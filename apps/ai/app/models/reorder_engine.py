"""
Reorder Engine — inventory replenishment suggestions.

Analyses current stock vs historical daily sales rate and supplier
lead times to determine *what*, *when*, and *how much* to reorder.
"""

import logging
from datetime import datetime, timedelta, date as date_type
from typing import Any, Dict, List, Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

# Default lead-time when supplier data is unavailable
_DEFAULT_LEAD_TIME_DAYS = 7
# Safety-stock multiplier (extra buffer above lead-time demand)
_SAFETY_STOCK_MULTIPLIER = 1.5


class ReorderEngine:
    """Generate reorder suggestions based on stock levels and sales velocity."""

    async def suggest(
        self,
        session: AsyncSession,
        tenant_id: str,
    ) -> List[Dict[str, Any]]:
        """
        Produce a prioritised list of products that need restocking.

        Parameters
        ----------
        session : AsyncSession
            Active database session.
        tenant_id : str
            Tenant identifier.

        Returns
        -------
        list[dict]
            Ordered by urgency (most critical first).
        """
        products = await self._fetch_products(session, tenant_id)
        if not products:
            return []

        pids = [p["id"] for p in products]
        daily_rates = await self._fetch_avg_daily_sales(session, tenant_id, pids)
        lead_times = await self._fetch_lead_times(session, tenant_id, pids)

        suggestions: List[Dict[str, Any]] = []
        for product in products:
            pid = product["id"]
            rate = daily_rates.get(pid, 0.0)
            lead = lead_times.get(pid, _DEFAULT_LEAD_TIME_DAYS)
            suggestion = self._build_suggestion(product, rate, lead)
            if suggestion is not None:
                suggestions.append(suggestion)

        suggestions.sort(key=lambda s: self._urgency_rank(s["urgency"]))
        return suggestions

    # ── Data fetching ───────────────────────────────────────────

    async def _fetch_products(
        self, session: AsyncSession, tenant_id: str
    ) -> List[Dict[str, Any]]:
        """Load active products with their stock info."""
        query = text("""
            SELECT id, name, sku,
                   "stockQuantity"     AS stock,
                   "lowStockThreshold" AS low_threshold,
                   "sellingPrice"      AS price
            FROM products
            WHERE "tenantId" = :tid AND "isActive" = true
            ORDER BY "stockQuantity" ASC
            LIMIT 300
        """)
        rows = await session.execute(query, {"tid": tenant_id})
        return [dict(r._mapping) for r in rows]

    async def _fetch_avg_daily_sales(
        self, session: AsyncSession, tenant_id: str, product_ids: List[str]
    ) -> Dict[str, float]:
        """Compute average daily sales over the last 30 days per product."""
        query = text("""
            SELECT oi."productId" AS product_id,
                   SUM(oi.quantity) AS total_qty
            FROM order_items oi
            JOIN orders o ON o.id = oi."orderId"
            WHERE o."tenantId" = :tid
              AND o.status NOT IN ('CANCELLED', 'RETURNED', 'REFUNDED')
              AND o."createdAt" >= :since
              AND oi."productId" = ANY(:pids)
            GROUP BY oi."productId"
        """)
        since = datetime.utcnow() - timedelta(days=30)
        rows = await session.execute(query, {"tid": tenant_id, "since": since, "pids": product_ids})
        return {r._mapping["product_id"]: float(r._mapping["total_qty"]) / 30.0 for r in rows}

    async def _fetch_lead_times(
        self, session: AsyncSession, tenant_id: str, product_ids: List[str]
    ) -> Dict[str, int]:
        """
        Estimate lead times from purchase-order history.

        Computes the average days between PO creation and receipt.
        """
        query = text("""
            SELECT poi."productId" AS product_id,
                   AVG(EXTRACT(EPOCH FROM (po."receivedAt" - po."createdAt")) / 86400) AS avg_days
            FROM purchase_order_items poi
            JOIN purchase_orders po ON po.id = poi."purchaseOrderId"
            WHERE po."tenantId" = :tid
              AND po."receivedAt" IS NOT NULL
              AND poi."productId" = ANY(:pids)
            GROUP BY poi."productId"
        """)
        rows = await session.execute(query, {"tid": tenant_id, "pids": product_ids})
        lead: Dict[str, int] = {}
        for r in rows:
            m = r._mapping
            avg = float(m["avg_days"]) if m["avg_days"] else _DEFAULT_LEAD_TIME_DAYS
            lead[m["product_id"]] = max(int(round(avg)), 1)
        return lead

    # ── Suggestion logic ────────────────────────────────────────

    def _build_suggestion(
        self,
        product: Dict[str, Any],
        avg_daily_sales: float,
        lead_time_days: int,
    ) -> Optional[Dict[str, Any]]:
        """
        Decide whether a product needs reordering and compute suggestion details.

        Returns ``None`` for products that are well-stocked with negligible sales.
        """
        stock = int(product.get("stock", 0))
        low_threshold = int(product.get("low_threshold", 10))

        # Days until stockout
        days_until_stockout: Optional[float] = None
        if avg_daily_sales > 0:
            days_until_stockout = stock / avg_daily_sales

        # Skip if stock is plentiful and no sales pressure
        if stock > low_threshold * 3 and (days_until_stockout is None or days_until_stockout > 90):
            return None

        # Suggested reorder quantity = lead-time demand * safety multiplier
        reorder_qty = max(int(round(avg_daily_sales * lead_time_days * _SAFETY_STOCK_MULTIPLIER)), 1)
        # Ensure we at least bring stock back above threshold
        if stock < low_threshold:
            reorder_qty = max(reorder_qty, low_threshold - stock + int(avg_daily_sales * 7))

        # Urgency
        urgency = self._determine_urgency(stock, low_threshold, days_until_stockout)

        # Suggested reorder date
        reorder_date: Optional[date_type] = None
        if days_until_stockout is not None:
            buffer_days = max(int(days_until_stockout) - lead_time_days - 2, 0)
            reorder_date = (datetime.utcnow() + timedelta(days=buffer_days)).date()
        elif stock <= low_threshold:
            reorder_date = datetime.utcnow().date()  # order now

        return {
            "product_id": product["id"],
            "product_name": product["name"],
            "sku": product.get("sku", ""),
            "current_stock": stock,
            "avg_daily_sales": round(avg_daily_sales, 2),
            "days_until_stockout": round(days_until_stockout, 1) if days_until_stockout else None,
            "suggested_reorder_qty": reorder_qty,
            "suggested_reorder_date": reorder_date,
            "estimated_lead_time_days": lead_time_days,
            "urgency": urgency,
        }

    @staticmethod
    def _determine_urgency(
        stock: int, threshold: int, days_until_stockout: Optional[float]
    ) -> str:
        """Categorise urgency based on stock level and projected depletion."""
        if stock == 0:
            return "critical"
        if days_until_stockout is not None and days_until_stockout <= 3:
            return "critical"
        if stock <= threshold or (days_until_stockout is not None and days_until_stockout <= 7):
            return "urgent"
        if days_until_stockout is not None and days_until_stockout <= 14:
            return "soon"
        return "normal"

    @staticmethod
    def _urgency_rank(urgency: str) -> int:
        """Return a sort key (lower = more urgent)."""
        return {"critical": 0, "urgent": 1, "soon": 2, "normal": 3}.get(urgency, 4)
