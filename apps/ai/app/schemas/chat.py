"""
Pydantic schemas for the AI chat endpoint.

Defines the request / response contracts consumed by
``POST /api/v1/ai/chat``.
"""

from typing import List, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Incoming chat message from the frontend."""

    message: str = Field(..., min_length=1, max_length=4000, description="User message text")
    conversation_id: Optional[str] = Field(None, description="Existing conversation ID to continue")
    tenant_id: str = Field(..., description="Tenant identifier")
    user_id: str = Field(..., description="User identifier")


class SuggestedAction(BaseModel):
    """A single actionable suggestion returned alongside the chat reply."""

    label: str = Field(..., description="Short action label shown to the user")
    action: str = Field(..., description="Machine-readable action type, e.g. 'navigate', 'run_report'")
    payload: Optional[dict] = Field(None, description="Optional payload for the action")


class InsightItem(BaseModel):
    """A single business insight surfaced during the conversation."""

    type: str = Field(..., description="Insight category, e.g. 'revenue', 'inventory', 'customer'")
    title: str = Field(..., description="Short human-readable title")
    description: str = Field(..., description="Detailed insight text")
    priority: str = Field("medium", description="Priority level: low / medium / high / critical")


class ChatResponse(BaseModel):
    """Reply sent back to the frontend after processing a chat message."""

    reply: str = Field(..., description="AI-generated response text")
    conversation_id: str = Field(..., description="Conversation ID (new or existing)")
    insights: List[InsightItem] = Field(default_factory=list, description="Relevant business insights")
    suggested_actions: List[SuggestedAction] = Field(
        default_factory=list, description="Suggested follow-up actions"
    )
