import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import chat, insights, forecast
from core.config import settings

load_dotenv()

app = FastAPI(
    title="OneMerchant AI Service",
    description="AI Engine for Commerce OS powering Chat, Insights, and Forecasting",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1/ai/chat", tags=["Chat"])
app.include_router(insights.router, prefix="/api/v1/ai/insights", tags=["Insights"])
app.include_router(forecast.router, prefix="/api/v1/ai/forecast", tags=["Forecast"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "onemerchant-ai", "model": "gemini-1.5-pro"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
