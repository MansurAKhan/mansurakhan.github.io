import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from providers.groq_client import stream_chat

load_dotenv()

app = FastAPI(title="Mansur.ai API")

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "https://mansurakhan.github.io")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN, "http://localhost:8080", "http://127.0.0.1:8080"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable is not set")


class ChatRequest(BaseModel):
    messages: list[dict]


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(400, "messages is required")

    return StreamingResponse(
        stream_chat(req.messages, GROQ_API_KEY),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

