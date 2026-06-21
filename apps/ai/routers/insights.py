from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

@router.get("/{tenant_id}")
async def get_insights(tenant_id: str):
    # Mocking AI generated insights based on tenant data
    return [
        {
            "type": "reorder",
            "title": "Restock Recommended",
            "description": "Based on current sales velocity, 'Wireless Headphones' will run out of stock in 4 days. Consider reordering 50 units.",
            "priority": "high",
            "action": "/inventory"
        },
        {
            "type": "marketing",
            "title": "Weekend Campaign",
            "description": "Sales typically drop 15% on weekends. Consider running a flash sale to boost conversions.",
            "priority": "medium",
            "action": "/marketing"
        },
        {
            "type": "customer",
            "title": "High Value Customers",
            "description": "You have 12 customers who haven't purchased in 60 days but previously spent >₹10k. Send them a re-engagement email.",
            "priority": "medium",
            "action": "/customers"
        }
    ]
