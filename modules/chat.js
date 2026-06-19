const GROQ_API_BASE = "https://api.groq.com/openai/v1/chat/completions";

let abortController = null;

export function cancelStream() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

export async function streamChat(apiKey, messages, onToken, onDone, onError) {
  cancelStream();
  abortController = new AbortController();

  try {
    const resp = await fetch(GROQ_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
      signal: abortController.signal,
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${resp.status}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || "";
          if (content) onToken(content);
        } catch {
          // skip malformed chunks
        }
      }
    }

    abortController = null;
    onDone();
  } catch (err) {
    if (err.name === "AbortError") return;
    abortController = null;
    onError(err.message);
  }
}
