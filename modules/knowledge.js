let knowledge = null;

export async function loadKnowledge() {
  if (knowledge) return knowledge;
  const resp = await fetch("data/knowledge.json");
  if (!resp.ok) throw new Error("Failed to load knowledge base");
  knowledge = await resp.json();
  return knowledge;
}

export function buildSystemPrompt(knowledge) {
  const { about, research, projects, civic } = knowledge;

  const papers = research.map((p, i) =>
    `  ${i + 1}. "${p.title}" — ${p.venue} (${p.year}). Authors: ${p.authors.join(", ")}. Links: ${Object.values(p.links).join(", ")}`
  ).join("\n");

  const projs = projects.map((p, i) =>
    `  ${i + 1}. "${p.name}" — ${p.description}. Links: ${Object.values(p.links).join(", ")}`
  ).join("\n");

  return `You are Mansur.ai, a helpful AI assistant with knowledge about Mansur Ali Khan. You answer questions about Mansur's background, research, projects, and policy work. Be concise, accurate, and helpful. Use the knowledge below to answer questions. If asked something you don't know, say so honestly. Do not pretend to be Mansur or speak as if you are him — you are an AI that knows about him.

ABOUT MANSUR:
Name: ${about.name}
Tagline: ${about.tagline}
Bio: ${about.bio}
Areas: ${about.tags.join(", ")}
LinkedIn: ${about.links.linkedin}
Resume: ${about.links.resume}

RESEARCH PUBLICATIONS:
${papers}

PROJECTS:
${projs}

CIVIC / POLICY WORK:
- Testimony: ${civic.testimony.title} — Bill ${civic.testimony.bill} before ${civic.testimony.hearing_body} (${civic.testimony.date})
- Video: ${civic.testimony.video}
- Full Hearing: ${civic.testimony.full_hearing}

When the user uses a slash command like /about, /research, /projects, /civic, or /help, provide the relevant information in a clear, structured format. For general chat, use the knowledge base to answer naturally.`;
}
