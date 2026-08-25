const SUPABASE_URL = "https://vxrlsdptvprzhqdaugdi.supabase.co/functions/v1/chat";

let abortController = null;

export function cancelStream() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

export async function streamChat(messages, onToken, onDone, onError) {
  cancelStream();
  abortController = new AbortController();

  try {
    const resp = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: abortController.signal,
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const message = err.error || `Server error: ${resp.status}`;
      const rateLimited = Boolean(err.rateLimited) || resp.status === 429 || /rate limit|rate_limit_exceeded|tokens per minute|TPM/i.test(message);
      throw Object.assign(new Error(message), { rateLimited });
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

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            onError(parsed.error);
            return;
          }
          const content = parsed.choices?.[0]?.delta?.content || "";
          if (content) onToken(content);
        } catch {
          // skip
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
