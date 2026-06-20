"""
Pydantic schemas for prediction, forecasting, and insight endpoints.

Covers demand forecasting, churn prediction, reorder suggestions,
product recommendations, and aggregated insight responses.
"""

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ── Demand Forecast ─────────────────────────────────────────────


class DemandForecastRequest(BaseModel):
    """Request body for the demand-forecast endpoint."""

    tenant_id: str = Field(..., description="Tenant identifier")
    product_ids: Optional[List[str]] = Field(
        None, description="Specific product IDs to forecast; omit for all products"
    )


class ProductForecast(BaseModel):
    """Demand forecast for a single product."""

    product_id: str
    product_name: str
    current_stock: int
    avg_daily_sales: float
    predicted_demand_7d: float = Field(..., description="Predicted units sold in next 7 days")
    predicted_demand_30d: float = Field(..., description="Predicted units sold in next 30 days")
    days_until_stockout: Optional[float] = Field(None, description="Estimated days until stock hits zero")
    confidence: float = Field(..., ge=0, le=1, description="Forecast confidence 0-1")


class DemandForecastResponse(BaseModel):
    """Response from the demand-forecast endpoint."""

    tenant_id: str
    generated_at: datetime
    predictions: List[ProductForecast]


# ── Churn Prediction ────────────────────────────────────────────


class ChurnPredictionRequest(BaseModel):
    """Request body for the churn-prediction endpoint."""

    tenant_id: str = Field(..., description="Tenant identifier")
    customer_ids: Optional[List[str]] = Field(
        None, description="Specific customer IDs to score; omit for all"
    )


class CustomerChurnScore(BaseModel):
    """Churn risk assessment for a single customer."""

    customer_id: str
    customer_name: str
    churn_probability: float = Field(..., ge=0, le=1, description="Probability of churning (0-1)")
    risk_level: str = Field(..., description="low / medium / high / critical")
    days_since_last_order: Optional[int] = None
    total_orders: int = 0
    total_spent: float = 0.0
    rfm_segment: str = Field("unknown", description="RFM segment label")


class ChurnPredictionResponse(BaseModel):
    """Response from the churn-prediction endpoint."""

    tenant_id: str
    generated_at: datetime
    predictions: List[CustomerChurnScore]


# ── Reorder Suggestions ────────────────────────────────────────


class ReorderItem(BaseModel):
    """A single reorder suggestion for an inventory item."""

    product_id: str
    product_name: str
    sku: str
    current_stock: int
    avg_daily_sales: float
    days_until_stockout: Optional[float] = None
    suggested_reorder_qty: int
    suggested_reorder_date: Optional[date] = None
    estimated_lead_time_days: int = 7
    urgency: str = Field("normal", description="normal / soon / urgent / critical")


class ReorderSuggestionResponse(BaseModel):
    """Response from the reorder-suggestions endpoint."""

    tenant_id: str
    generated_at: datetime
    suggestions: List[ReorderItem]


# ── Product Recommendations ────────────────────────────────────


class ProductRecommendationRequest(BaseModel):
    """Request body for the product-recommendations endpoint."""

    tenant_id: str = Field(..., description="Tenant identifier")


class Recommendation(BaseModel):
    """A single product recommendation."""

    product_id: str
    product_name: str
    recommendation_type: str = Field(
        ..., description="frequently_bought_together / top_margin / promote"
    )
    score: float = Field(..., ge=0, le=1, description="Relevance score 0-1")
    reason: str = Field(..., description="Human-readable rationale")
    related_product_ids: List[str] = Field(default_factory=list)


class ProductRecommendationResponse(BaseModel):
    """Response from the product-recommendations endpoint."""

    tenant_id: str
    generated_at: datetime
    recommendations: List[Recommendation]


# ── Aggregated Insights ────────────────────────────────────────


class InsightEntry(BaseModel):
    """A single AI-generated business insight."""

    type: str = Field(..., description="Category: revenue / inventory / customer / marketing / general")
    title: str
    description: str
    priority: str = Field("medium", description="low / medium / high / critical")
    data: Optional[dict] = None


class InsightResponse(BaseModel):
    """Aggregated insights response."""

    tenant_id: str
    generated_at: datetime
    insights: List[InsightEntry]
