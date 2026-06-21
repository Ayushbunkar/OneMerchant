from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import google.generativeai as genai
from core.config import settings
import uuid

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    tenant_id: str
    user_id: str

class ChatResponse(BaseModel):
    reply: str
    conversation_id: str

# In-memory session store (use Redis in prod)
sessions = {}

@router.post("", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    conversation_id = req.conversation_id or str(uuid.uuid4())
    
    if conversation_id not in sessions:
        # Initialize new chat session
        chat_session = model.start_chat(history=[
            {"role": "user", "parts": [f"You are the OneMerchant AI Assistant. You help business owners manage their ecommerce operations, analyze data, and create marketing campaigns. The current tenant ID is {req.tenant_id}."]},
            {"role": "model", "parts": ["I understand. I am the OneMerchant AI Assistant, ready to help you manage your business, analyze your data, and grow your sales. How can I assist you today?"]}
        ])
        sessions[conversation_id] = chat_session
    else:
        chat_session = sessions[conversation_id]

    try:
        # Generate response
        response = chat_session.send_message(req.message)
        
        # In a real app, you might trigger specific tools here (e.g. querying the DB)
        
        return ChatResponse(
            reply=response.text,
            conversation_id=conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
