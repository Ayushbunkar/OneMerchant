"""
Demand Forecasting Model.

Uses simple moving average + linear trend analysis on historical order
data.  When enough data points exist, a scikit-learn ``LinearRegression``
is used; otherwise, heuristic averages are applied so that forecasts are
always returned — even for brand-new products.
"""

import logging
from datetime import datetime, timedelta, date
from typing import Any, Dict, List, Optional

import numpy as np
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

# Minimum number of daily data points required for regression
_MIN_REGRESSION_POINTS = 7


class DemandForecaster:
    """Predict future demand per product using order history."""

    async def predict(
        self,
        session: AsyncSession,
        tenant_id: str,
        product_ids: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Generate demand predictions for the given tenant's products.

        Parameters
        ----------
        session : AsyncSession
            Active database session.
        tenant_id : str
            Tenant to forecast for.
        product_ids : list[str] | None
            Specific products; ``None`` means all active products.

        Returns
        -------
        list[dict]
            One dict per product with forecast fields.
        """
        products = await self._fetch_products(session, tenant_id, product_ids)
        if not products:
            return []

        product_id_list = [p["id"] for p in products]
        sales_history = await self._fetch_daily_sales(session, tenant_id, product_id_list)

        results: List[Dict[str, Any]] = []
        for product in products:
            pid = product["id"]
            daily_sales = sales_history.get(pid, [])
            forecast = self._forecast_product(product, daily_sales)
            results.append(forecast)

        results.sort(key=lambda r: r.get("days_until_stockout") or 9999)
        return results

    # ── Data fetching ───────────────────────────────────────────

    async def _fetch_products(
        self, session: AsyncSession, tenant_id: str, product_ids: Optional[List[str]]
    ) -> List[Dict[str, Any]]:
        """Load active products from the database."""
        query = text("""
            SELECT id, name, sku, "stockQuantity" AS stock, "sellingPrice" AS price,
                   "costPrice" AS cost, "lowStockThreshold" AS low_threshold
            FROM products
            WHERE "tenantId" = :tid AND "isActive" = true
        """ + (" AND id = ANY(:pids)" if product_ids else "") + """
            ORDER BY name
            LIMIT 200
        """)
        params: dict[str, Any] = {"tid": tenant_id}
        if product_ids:
            params["pids"] = product_ids
        rows = await session.execute(query, params)
        return [dict(r._mapping) for r in rows]

    async def _fetch_daily_sales(
        self, session: AsyncSession, tenant_id: str, product_ids: List[str]
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Fetch daily aggregated sales for the last 90 days,
        grouped by product.
        """
        query = text("""
            SELECT oi."productId" AS product_id,
                   DATE(o."createdAt") AS sale_date,
                   SUM(oi.quantity) AS qty
            FROM order_items oi
            JOIN orders o ON o.id = oi."orderId"
            WHERE o."tenantId" = :tid
              AND o.status NOT IN ('CANCELLED', 'RETURNED', 'REFUNDED')
              AND o."createdAt" >= :since
              AND oi."productId" = ANY(:pids)
            GROUP BY oi."productId", DATE(o."createdAt")
            ORDER BY sale_date
        """)
        since = datetime.utcnow() - timedelta(days=90)
        rows = await session.execute(query, {"tid": tenant_id, "since": since, "pids": product_ids})

        history: Dict[str, List[Dict[str, Any]]] = {}
        for r in rows:
            m = r._mapping
            pid = m["product_id"]
            history.setdefault(pid, []).append({"date": m["sale_date"], "qty": float(m["qty"])})
        return history

    # ── Forecasting logic ───────────────────────────────────────

    def _forecast_product(
        self,
        product: Dict[str, Any],
        daily_sales: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Forecast demand for a single product, returning a result dict.

        Uses linear regression when >= 7 data points exist, otherwise
        falls back to simple moving average.
        """
        stock = int(product.get("stock", 0))
        name = product["name"]
        pid = product["id"]

        if not daily_sales:
            return self._heuristic_forecast(pid, name, stock, avg_daily=0.0, confidence=0.3)

        quantities = [d["qty"] for d in daily_sales]
        num_days = max(
            (daily_sales[-1]["date"] - daily_sales[0]["date"]).days
            if isinstance(daily_sales[0]["date"], date) else 1,
            1,
        )
        avg_daily = sum(quantities) / max(num_days, 1)

        if len(daily_sales) >= _MIN_REGRESSION_POINTS:
            return self._regression_forecast(pid, name, stock, daily_sales, avg_daily)

        return self._heuristic_forecast(pid, name, stock, avg_daily, confidence=0.5)

    def _regression_forecast(
        self,
        pid: str,
        name: str,
        stock: int,
        daily_sales: List[Dict[str, Any]],
        avg_daily: float,
    ) -> Dict[str, Any]:
        """Use linear regression on the daily sales data to extrapolate demand."""
        try:
            from sklearn.linear_model import LinearRegression

            base_date = daily_sales[0]["date"]
            X = np.array([(d["date"] - base_date).days for d in daily_sales]).reshape(-1, 1)
            y = np.array([d["qty"] for d in daily_sales])

            model = LinearRegression()
            model.fit(X, y)

            last_day = int(X[-1][0])
            future_7 = np.array(range(last_day + 1, last_day + 8)).reshape(-1, 1)
            future_30 = np.array(range(last_day + 1, last_day + 31)).reshape(-1, 1)

            pred_7 = max(float(np.sum(np.maximum(model.predict(future_7), 0))), 0)
            pred_30 = max(float(np.sum(np.maximum(model.predict(future_30), 0))), 0)

            r2 = max(float(model.score(X, y)), 0)
            confidence = min(0.5 + r2 * 0.5, 1.0)

            trend_daily = avg_daily + float(model.coef_[0])
            effective_daily = max(trend_daily, avg_daily * 0.5)
            days_until_stockout = stock / effective_daily if effective_daily > 0 else None

            return {
                "product_id": pid,
                "product_name": name,
                "current_stock": stock,
                "avg_daily_sales": round(avg_daily, 2),
                "predicted_demand_7d": round(pred_7, 1),
                "predicted_demand_30d": round(pred_30, 1),
                "days_until_stockout": round(days_until_stockout, 1) if days_until_stockout else None,
                "confidence": round(confidence, 2),
            }
        except Exception as exc:
            logger.warning("Regression failed for %s, using heuristic: %s", pid, exc)
            return self._heuristic_forecast(pid, name, stock, avg_daily, confidence=0.5)

    @staticmethod
    def _heuristic_forecast(
        pid: str, name: str, stock: int, avg_daily: float, confidence: float
    ) -> Dict[str, Any]:
        """Simple moving-average-based forecast when regression isn't viable."""
        pred_7 = avg_daily * 7
        pred_30 = avg_daily * 30
        days_until_stockout = stock / avg_daily if avg_daily > 0 else None

        return {
            "product_id": pid,
            "product_name": name,
            "current_stock": stock,
            "avg_daily_sales": round(avg_daily, 2),
            "predicted_demand_7d": round(pred_7, 1),
            "predicted_demand_30d": round(pred_30, 1),
            "days_until_stockout": round(days_until_stockout, 1) if days_until_stockout else None,
            "confidence": round(confidence, 2),
        }
