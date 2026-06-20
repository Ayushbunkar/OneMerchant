"""
AI Chat Engine — orchestrates LLM-powered business conversations.

Uses OpenAI when an API key is available, otherwise falls back to a
comprehensive rule-based responder that can answer common business
questions using context data alone.
"""

import logging
import re
from typing import Any, Dict, List, Optional

from openai import AsyncOpenAI

from app.core.config import get_settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are **OneMerchant AI**, an expert business assistant for Indian small-and-medium
merchants.  You help with inventory management, order tracking, customer insights,
marketing suggestions, and financial analysis.

Guidelines:
- Be concise and actionable.  Merchants are busy.
- When providing numbers, use Indian Rupee (₹) formatting.
- Proactively surface risks (low stock, declining customers) and opportunities.
- If the user asks something outside your business domain, politely redirect.
- Always ground your answers in the business context provided below.

{context}
"""


class ChatEngine:
    """Hybrid LLM + rule-based conversational engine."""

    def __init__(self) -> None:
        """Initialise the engine, setting up the OpenAI client if possible."""
        settings = get_settings()
        self._model = settings.AI_MODEL
        self._openai_available = settings.openai_available
        self._client: Optional[AsyncOpenAI] = None

        if self._openai_available:
            self._client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            logger.info("ChatEngine: OpenAI client initialised (model=%s)", self._model)
        else:
            logger.info("ChatEngine: No OpenAI key — using rule-based fallback")

    # ── Public API ──────────────────────────────────────────────

    async def chat(
        self,
        message: str,
        context: str = "",
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Generate a business-relevant reply to the user's *message*.

        Parameters
        ----------
        message:
            The latest user message.
        context:
            A formatted string of current business stats (revenue, stock, etc.)
        conversation_history:
            Previous messages in ``[{"role": ..., "content": ...}]`` format.

        Returns
        -------
        str
            The assistant's reply text.
        """
        if self._openai_available and self._client is not None:
            try:
                return await self._openai_chat(message, context, conversation_history)
            except Exception as exc:
                logger.error("OpenAI call failed, falling back to rules: %s", exc)

        return self._rule_based_chat(message, context)

    # ── OpenAI path ─────────────────────────────────────────────

    async def _openai_chat(
        self,
        message: str,
        context: str,
        history: Optional[List[Dict[str, str]]],
    ) -> str:
        """Send the conversation to OpenAI and return the assistant reply."""
        system = SYSTEM_PROMPT.format(context=context or "No business context available yet.")

        messages: list[dict[str, str]] = [{"role": "system", "content": system}]
        if history:
            messages.extend(history[-20:])  # keep context window manageable
        messages.append({"role": "user", "content": message})

        response = await self._client.chat.completions.create(  # type: ignore[union-attr]
            model=self._model,
            messages=messages,  # type: ignore[arg-type]
            temperature=0.7,
            max_tokens=1024,
        )
        return response.choices[0].message.content or "I'm sorry, I couldn't generate a response."

    # ── Rule-based fallback ─────────────────────────────────────

    def _rule_based_chat(self, message: str, context: str) -> str:
        """
        Provide a helpful response using keyword matching and the business
        context string, without any LLM call.
        """
        msg = message.lower().strip()
        ctx = self._parse_context(context)

        # Greeting
        if self._matches(msg, ["hi", "hello", "hey", "good morning", "good evening", "namaste"]):
            return (
                "Hello! 👋 I'm your OneMerchant AI assistant. I can help you with:\n\n"
                "• **Sales & Revenue** — recent performance and trends\n"
                "• **Inventory** — stock levels and reorder alerts\n"
                "• **Customers** — activity and churn risk\n"
                "• **Recommendations** — products to promote\n\n"
                "What would you like to know?"
            )

        # Revenue / sales
        if self._matches(msg, ["revenue", "sales", "income", "earning", "turnover", "how much"]):
            revenue = ctx.get("total_revenue_30d", "N/A")
            orders = ctx.get("total_orders_30d", "N/A")
            return (
                f"📊 **Last 30 Days Performance**\n\n"
                f"• Total Revenue: ₹{revenue}\n"
                f"• Total Orders: {orders}\n\n"
                f"Would you like a detailed breakdown by product or time period?"
            )

        # Inventory / stock
        if self._matches(msg, ["inventory", "stock", "warehouse", "low stock", "out of stock", "reorder"]):
            low = ctx.get("low_stock_products", [])
            if low:
                items = "\n".join(f"  - {p}" for p in low[:5])
                return (
                    f"⚠️ **Low Stock Alert**\n\n"
                    f"These products need attention:\n{items}\n\n"
                    f"I can generate detailed reorder suggestions if you'd like."
                )
            return (
                "✅ Your inventory looks healthy right now! No critically low-stock items detected.\n\n"
                "I can still run a demand forecast to predict upcoming needs — just ask."
            )

        # Customers
        if self._matches(msg, ["customer", "churn", "retention", "buyer", "client"]):
            return (
                "👥 **Customer Insights**\n\n"
                "I can analyse your customer base for:\n"
                "• **Churn risk** — identify customers likely to leave\n"
                "• **RFM segmentation** — Recency, Frequency, Monetary grouping\n"
                "• **Top customers** — your most valuable buyers\n\n"
                "Which analysis would you like me to run?"
            )

        # Products / recommendations
        if self._matches(msg, ["product", "recommend", "best seller", "top selling", "promote", "margin"]):
            top = ctx.get("top_products", [])
            if top:
                items = "\n".join(f"  {i+1}. {p}" for i, p in enumerate(top[:5]))
                return f"🏆 **Top Products (Last 30 Days)**\n\n{items}\n\nWant promotion or bundling suggestions?"
            return (
                "I can generate product recommendations including:\n"
                "• Frequently bought together\n"
                "• High-margin items to promote\n"
                "• Under-performing products\n\n"
                "Shall I run the analysis?"
            )

        # Orders
        if self._matches(msg, ["order", "pending", "shipped", "delivered", "cancelled"]):
            orders = ctx.get("total_orders_30d", "N/A")
            return (
                f"📦 **Orders Summary**\n\n"
                f"• Total orders (30 days): {orders}\n\n"
                f"I can help you track specific orders or analyse order trends. "
                f"What would you like to know?"
            )

        # Help / capabilities
        if self._matches(msg, ["help", "what can you do", "capabilities", "feature"]):
            return (
                "I'm your AI-powered business assistant! Here's what I can do:\n\n"
                "📊 **Analytics** — Revenue trends, sales performance\n"
                "📦 **Inventory** — Stock alerts, reorder suggestions\n"
                "🔮 **Forecasting** — Demand predictions, stockout warnings\n"
                "👥 **Customers** — Churn prediction, segmentation\n"
                "🎯 **Marketing** — Product recommendations, promotion ideas\n"
                "💬 **General Q&A** — Ask me anything about your business!\n\n"
                "Just type your question and I'll do my best to help."
            )

        # Thank you
        if self._matches(msg, ["thank", "thanks", "great", "awesome", "perfect"]):
            return "You're welcome! 😊 Feel free to ask anytime you need help with your business."

        # Forecast
        if self._matches(msg, ["forecast", "predict", "future", "trend", "projection"]):
            return (
                "🔮 **Forecasting**\n\n"
                "I can predict:\n"
                "• **Demand** — Expected sales volume per product\n"
                "• **Stockout risk** — When you'll run out of inventory\n"
                "• **Revenue trends** — Projected revenue for next 30 days\n\n"
                "Which forecast would you like me to generate?"
            )

        # Supplier
        if self._matches(msg, ["supplier", "vendor", "purchase order", "procurement"]):
            return (
                "🏭 **Supplier Management**\n\n"
                "I can help you with:\n"
                "• Analysing supplier performance and lead times\n"
                "• Generating optimal purchase order quantities\n"
                "• Identifying the best suppliers for each product\n\n"
                "What would you like to know?"
            )

        # Fallback
        return (
            "I understand you're asking about your business. Here are some things I can help with:\n\n"
            "• Say **'sales'** to see revenue data\n"
            "• Say **'inventory'** to check stock levels\n"
            "• Say **'customers'** for customer insights\n"
            "• Say **'forecast'** for demand predictions\n"
            "• Say **'help'** to see all my capabilities\n\n"
            "Could you rephrase your question or pick one of the options above?"
        )

    # ── Helpers ──────────────────────────────────────────────────

    @staticmethod
    def _matches(text: str, keywords: List[str]) -> bool:
        """Return ``True`` if *text* contains any of the *keywords*."""
        return any(kw in text for kw in keywords)

    @staticmethod
    def _parse_context(context: str) -> Dict[str, Any]:
        """
        Extract structured values from the context string produced by
        ``ContextBuilder``.  Returns a dict with best-effort extracted values.
        """
        data: Dict[str, Any] = {}
        if not context:
            return data

        # Revenue
        m = re.search(r"Total Revenue.*?₹([\d,\.]+)", context)
        if m:
            data["total_revenue_30d"] = m.group(1)

        # Orders count
        m = re.search(r"Total Orders.*?(\d+)", context)
        if m:
            data["total_orders_30d"] = m.group(1)

        # Top products
        top_products: list[str] = []
        for match in re.finditer(r"\d+\.\s+(.+?)(?:\s*—|\s*-|\n|$)", context):
            name = match.group(1).strip()
            if name and len(name) < 100:
                top_products.append(name)
        if top_products:
            data["top_products"] = top_products

        # Low stock
        low_stock: list[str] = []
        low_section = False
        for line in context.split("\n"):
            if "low stock" in line.lower() or "⚠" in line:
                low_section = True
                continue
            if low_section and line.strip().startswith("-"):
                low_stock.append(line.strip().lstrip("- "))
            elif low_section and line.strip() == "":
                low_section = False
        if low_stock:
            data["low_stock_products"] = low_stock

        return data
