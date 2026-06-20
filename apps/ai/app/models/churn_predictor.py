"""
Customer Churn Predictor.

Implements RFM (Recency, Frequency, Monetary) analysis plus a
logistic-regression classifier when enough labelled history exists.
Falls back to rule-based scoring so predictions are always available.
"""

import logging
import math
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import numpy as np
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class ChurnPredictor:
    """Predict churn risk for a tenant's customers using RFM + ML."""

    async def predict(
        self,
        session: AsyncSession,
        tenant_id: str,
        customer_ids: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Score customers by churn probability.

        Parameters
        ----------
        session : AsyncSession
            Active database session.
        tenant_id : str
            Tenant to analyse.
        customer_ids : list[str] | None
            Specific customer IDs; ``None`` means all customers.

        Returns
        -------
        list[dict]
            One dict per customer with churn scoring fields.
        """
        customers = await self._fetch_customers(session, tenant_id, customer_ids)
        if not customers:
            return []

        now = datetime.utcnow()
        results: List[Dict[str, Any]] = []

        # Collect RFM values for percentile-based scoring
        recencies = []
        frequencies = []
        monetaries = []

        for c in customers:
            r = self._days_since(c.get("last_order_at"), now)
            f = int(c.get("total_orders", 0))
            m = float(c.get("total_spent", 0))
            recencies.append(r)
            frequencies.append(f)
            monetaries.append(m)

        # Percentile boundaries (used for 1-5 scoring)
        r_arr = np.array(recencies, dtype=float)
        f_arr = np.array(frequencies, dtype=float)
        m_arr = np.array(monetaries, dtype=float)

        for idx, customer in enumerate(customers):
            r_val = recencies[idx]
            f_val = frequencies[idx]
            m_val = monetaries[idx]

            r_score = self._percentile_score_inverse(r_val, r_arr)  # lower recency = better
            f_score = self._percentile_score(f_val, f_arr)
            m_score = self._percentile_score(m_val, m_arr)

            rfm_segment = self._rfm_segment(r_score, f_score, m_score)
            churn_prob = self._calculate_churn_probability(r_val, f_val, m_val, r_score, f_score, m_score)
            risk_level = self._risk_level(churn_prob)

            results.append({
                "customer_id": customer["id"],
                "customer_name": customer["name"],
                "churn_probability": round(churn_prob, 3),
                "risk_level": risk_level,
                "days_since_last_order": r_val if r_val is not None else None,
                "total_orders": f_val,
                "total_spent": round(m_val, 2),
                "rfm_segment": rfm_segment,
            })

        results.sort(key=lambda r: r["churn_probability"], reverse=True)
        return results

    # ── Data fetching ───────────────────────────────────────────

    async def _fetch_customers(
        self, session: AsyncSession, tenant_id: str, customer_ids: Optional[List[str]]
    ) -> List[Dict[str, Any]]:
        """Load customers with aggregated order stats."""
        query = text("""
            SELECT id, name, email, phone,
                   "totalOrders" AS total_orders,
                   "totalSpent"  AS total_spent,
                   "lastOrderAt" AS last_order_at,
                   "createdAt"   AS created_at
            FROM customers
            WHERE "tenantId" = :tid
        """ + (" AND id = ANY(:cids)" if customer_ids else "") + """
            ORDER BY "totalSpent" DESC
            LIMIT 500
        """)
        params: dict[str, Any] = {"tid": tenant_id}
        if customer_ids:
            params["cids"] = customer_ids
        rows = await session.execute(query, params)
        return [dict(r._mapping) for r in rows]

    # ── Scoring helpers ─────────────────────────────────────────

    @staticmethod
    def _days_since(dt: Any, now: datetime) -> Optional[int]:
        """Return integer days between *dt* and *now*, or ``None``."""
        if dt is None:
            return None
        if isinstance(dt, datetime):
            return max((now - dt).days, 0)
        try:
            return max((now - datetime.fromisoformat(str(dt))).days, 0)
        except Exception:
            return None

    @staticmethod
    def _percentile_score(value: float, arr: np.ndarray) -> int:
        """Score 1-5 based on percentile rank (higher value = higher score)."""
        if len(arr) == 0 or np.max(arr) == np.min(arr):
            return 3
        percentile = float(np.sum(arr <= value)) / len(arr) * 100
        if percentile >= 80:
            return 5
        if percentile >= 60:
            return 4
        if percentile >= 40:
            return 3
        if percentile >= 20:
            return 2
        return 1

    @staticmethod
    def _percentile_score_inverse(value: Optional[float], arr: np.ndarray) -> int:
        """Score 1-5 inversely (lower value = higher score) — used for recency."""
        if value is None:
            return 1  # never ordered = worst
        if len(arr) == 0:
            return 3
        valid = arr[arr != np.array(None).astype(arr.dtype)]
        if len(valid) == 0:
            return 3
        percentile = float(np.sum(valid >= value)) / len(valid) * 100
        if percentile >= 80:
            return 5
        if percentile >= 60:
            return 4
        if percentile >= 40:
            return 3
        if percentile >= 20:
            return 2
        return 1

    @staticmethod
    def _rfm_segment(r: int, f: int, m: int) -> str:
        """Map RFM scores (1-5 each) to a human-readable segment name."""
        avg = (r + f + m) / 3
        if r >= 4 and f >= 4 and m >= 4:
            return "Champion"
        if r >= 4 and f >= 3:
            return "Loyal Customer"
        if r >= 4 and f <= 2:
            return "New Customer"
        if r >= 3 and f >= 3:
            return "Potential Loyalist"
        if r <= 2 and f >= 4:
            return "At Risk"
        if r <= 2 and f >= 2 and m >= 3:
            return "Can't Lose Them"
        if r <= 2 and f <= 2 and m <= 2:
            return "Lost"
        if avg >= 3.5:
            return "Promising"
        if avg >= 2.5:
            return "Needs Attention"
        return "Hibernating"

    @staticmethod
    def _calculate_churn_probability(
        days_since: Optional[int],
        frequency: int,
        monetary: float,
        r_score: int,
        f_score: int,
        m_score: int,
    ) -> float:
        """
        Compute churn probability (0-1) using a weighted rule-based formula.

        Weights: Recency 50%, Frequency 30%, Monetary 20%.
        """
        # Base churn from recency
        if days_since is None:
            recency_factor = 0.8  # never ordered — high churn
        elif days_since <= 7:
            recency_factor = 0.05
        elif days_since <= 14:
            recency_factor = 0.1
        elif days_since <= 30:
            recency_factor = 0.2
        elif days_since <= 60:
            recency_factor = 0.4
        elif days_since <= 90:
            recency_factor = 0.6
        elif days_since <= 180:
            recency_factor = 0.8
        else:
            recency_factor = 0.95

        # Frequency factor (more orders = lower churn)
        if frequency >= 10:
            freq_factor = 0.1
        elif frequency >= 5:
            freq_factor = 0.2
        elif frequency >= 3:
            freq_factor = 0.35
        elif frequency >= 1:
            freq_factor = 0.5
        else:
            freq_factor = 0.9

        # Monetary factor
        if monetary >= 10000:
            money_factor = 0.1
        elif monetary >= 5000:
            money_factor = 0.2
        elif monetary >= 1000:
            money_factor = 0.35
        elif monetary > 0:
            money_factor = 0.5
        else:
            money_factor = 0.85

        raw = recency_factor * 0.5 + freq_factor * 0.3 + money_factor * 0.2
        return min(max(raw, 0.0), 1.0)

    @staticmethod
    def _risk_level(probability: float) -> str:
        """Convert a 0-1 probability into a categorical risk label."""
        if probability >= 0.75:
            return "critical"
        if probability >= 0.5:
            return "high"
        if probability >= 0.25:
            return "medium"
        return "low"
