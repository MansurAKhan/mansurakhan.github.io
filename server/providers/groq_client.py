import os
import json
import httpx

GROQ_API_BASE = "https://api.groq.com/openai/v1/chat/completions"


async def stream_chat(messages: list, api_key: str):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "stream": True,
        "temperature": 0.7,
        "max_tokens": 2048,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream("POST", GROQ_API_BASE, json=body, headers=headers) as resp:
            if resp.status_code != 200:
                err_body = await resp.aread()
                try:
                    err = json.loads(err_body)
                    detail = err.get("error", {}).get("message", str(resp.status_code))
                except Exception:
                    detail = err_body.decode()
                yield f"data: {json.dumps({'error': detail})}\n\n"
                return

            async for chunk in resp.aiter_lines():
                if chunk.startswith("data: "):
                    yield chunk + "\n"
