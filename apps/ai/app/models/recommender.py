"""
Product Recommender — market-basket analysis + margin-based suggestions.

Provides three recommendation types:
1. **Frequently bought together** — co-occurrence in the same orders.
2. **Top margin** — products with the best profit margins.
3. **Promote** — high-margin products with low visibility (few sales).
"""

import logging
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from itertools import combinations
from typing import Any, Dict, List

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class ProductRecommender:
    """Generate product-level recommendations for a tenant."""

    async def recommend(
        self,
        session: AsyncSession,
        tenant_id: str,
    ) -> List[Dict[str, Any]]:
        """
        Return a combined list of recommendations sorted by score.

        Parameters
        ----------
        session : AsyncSession
            Active database session.
        tenant_id : str
            Tenant identifier.

        Returns
        -------
        list[dict]
            Combined recommendation entries.
        """
        products = await self._fetch_products(session, tenant_id)
        order_baskets = await self._fetch_order_baskets(session, tenant_id)

        recommendations: List[Dict[str, Any]] = []
        recommendations.extend(self._frequently_bought_together(products, order_baskets))
        recommendations.extend(self._top_margin(products))
        recommendations.extend(self._promote(products, order_baskets))

        recommendations.sort(key=lambda r: r["score"], reverse=True)
        return recommendations[:30]  # cap at 30

    # ── Data fetching ───────────────────────────────────────────

    async def _fetch_products(
        self, session: AsyncSession, tenant_id: str
    ) -> Dict[str, Dict[str, Any]]:
        """Load active products keyed by ID."""
        query = text("""
            SELECT id, name, sku, "sellingPrice" AS price, "costPrice" AS cost,
                   "stockQuantity" AS stock
            FROM products
            WHERE "tenantId" = :tid AND "isActive" = true
            ORDER BY name
            LIMIT 500
        """)
        rows = await session.execute(query, {"tid": tenant_id})
        return {r._mapping["id"]: dict(r._mapping) for r in rows}

    async def _fetch_order_baskets(
        self, session: AsyncSession, tenant_id: str
    ) -> List[List[str]]:
        """
        Return a list of baskets, where each basket is a list of product IDs
        from a single order (last 90 days).
        """
        query = text("""
            SELECT oi."orderId" AS order_id, oi."productId" AS product_id
            FROM order_items oi
            JOIN orders o ON o.id = oi."orderId"
            WHERE o."tenantId" = :tid
              AND o.status NOT IN ('CANCELLED', 'RETURNED', 'REFUNDED')
              AND o."createdAt" >= :since
            ORDER BY oi."orderId"
        """)
        since = datetime.utcnow() - timedelta(days=90)
        rows = await session.execute(query, {"tid": tenant_id, "since": since})

        baskets_map: Dict[str, List[str]] = defaultdict(list)
        for r in rows:
            m = r._mapping
            baskets_map[m["order_id"]].append(m["product_id"])

        return [pids for pids in baskets_map.values() if len(pids) >= 2]

    # ── Recommendation strategies ───────────────────────────────

    def _frequently_bought_together(
        self,
        products: Dict[str, Dict[str, Any]],
        baskets: List[List[str]],
    ) -> List[Dict[str, Any]]:
        """Find product pairs that frequently co-occur in orders."""
        if not baskets:
            return []

        pair_counts: Counter = Counter()
        for basket in baskets:
            unique_ids = list(set(basket))
            for pair in combinations(sorted(unique_ids), 2):
                pair_counts[pair] += 1

        total_baskets = len(baskets)
        results: List[Dict[str, Any]] = []
        for (pid_a, pid_b), count in pair_counts.most_common(10):
            if pid_a not in products or pid_b not in products:
                continue
            support = count / total_baskets
            score = min(support * 5, 1.0)  # normalise
            results.append({
                "product_id": pid_a,
                "product_name": products[pid_a]["name"],
                "recommendation_type": "frequently_bought_together",
                "score": round(score, 3),
                "reason": (
                    f"Bought together with {products[pid_b]['name']} "
                    f"in {count} orders ({support:.0%} of baskets)"
                ),
                "related_product_ids": [pid_b],
            })
        return results

    def _top_margin(
        self,
        products: Dict[str, Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Identify products with the highest profit margins."""
        margins: List[tuple] = []
        for pid, p in products.items():
            price = float(p.get("price", 0))
            cost = float(p.get("cost", 0))
            if price > 0 and cost > 0:
                margin_pct = (price - cost) / price
                margins.append((pid, margin_pct, price - cost))

        margins.sort(key=lambda x: x[1], reverse=True)
        results: List[Dict[str, Any]] = []
        for pid, margin_pct, margin_abs in margins[:10]:
            p = products[pid]
            results.append({
                "product_id": pid,
                "product_name": p["name"],
                "recommendation_type": "top_margin",
                "score": round(min(margin_pct, 1.0), 3),
                "reason": f"Margin {margin_pct:.0%} (₹{margin_abs:.0f} per unit)",
                "related_product_ids": [],
            })
        return results

    def _promote(
        self,
        products: Dict[str, Dict[str, Any]],
        baskets: List[List[str]],
    ) -> List[Dict[str, Any]]:
        """Find high-margin products with low sales visibility — ripe for promotion."""
        # Count how many baskets each product appears in
        appearance: Counter = Counter()
        for basket in baskets:
            for pid in set(basket):
                appearance[pid] += 1

        total_baskets = max(len(baskets), 1)
        results: List[Dict[str, Any]] = []

        for pid, p in products.items():
            price = float(p.get("price", 0))
            cost = float(p.get("cost", 0))
            if price <= 0 or cost <= 0:
                continue
            margin_pct = (price - cost) / price
            visibility = appearance.get(pid, 0) / total_baskets

            # High margin but low visibility = promotion candidate
            if margin_pct >= 0.3 and visibility < 0.1:
                score = margin_pct * (1 - visibility)
                results.append({
                    "product_id": pid,
                    "product_name": p["name"],
                    "recommendation_type": "promote",
                    "score": round(min(score, 1.0), 3),
                    "reason": (
                        f"High margin ({margin_pct:.0%}) but only appears in "
                        f"{appearance.get(pid, 0)} orders — great promotion candidate"
                    ),
                    "related_product_ids": [],
                })

        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:10]
