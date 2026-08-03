let commands = [];

export async function loadCommands() {
  const resp = await fetch("data/commands.json");
  if (!resp.ok) throw new Error("Failed to load commands");
  commands = await resp.json();
  return commands;
}

export function findCommand(input) {
  const trimmed = input.trim().toLowerCase();
  return commands.find((c) => c.trigger === trimmed) || null;
}

export function isCommand(input) {
  return input.trim().startsWith("/");
}

export function renderHelp(knowledge) {
  let html = '<div class="section-title">Available Commands</div>';
  html += '<ul class="cmd-list">';
  for (const cmd of commands) {
    html += `<li><span class="cmd">${cmd.trigger}</span> ${cmd.description}</li>`;
  }
  html += "</ul>";
  return html;
}

export function renderAbout(knowledge) {
  const { about } = knowledge;
  let html = `<div class="section-title">${about.name}</div>`;
  html += `<div class="entry">`;
   html += `<div class="meta">${about.tagline}</div>`;
   html += `<p>${about.bio}</p>`;
   html += `<div class="meta">Areas: ${about.tags.join(" · ")}</div>`;
  html += `<div class="links">`;
  html += `<a href="${about.links.linkedin}" target="_blank">LinkedIn ↗</a>`;
  html += `</div>`;
  html += `</div>`;
  return html;
}

export function renderResearch(knowledge) {
  let html = '<div class="section-title">Publications</div>';
  for (const p of knowledge.research) {
    html += `<div class="entry">`;
    html += `<div class="title">"${p.title}"</div>`;
    html += `<div class="meta">${p.authors.join(", ")}</div>`;
    html += `<div class="meta">${p.venue} · ${p.year}</div>`;
    html += `<div class="links">`;
    if (p.links.openreview) html += `<a href="${p.links.openreview}" target="_blank">OpenReview ↗</a>`;
    if (p.links.pdf) html += `<a href="${p.links.pdf}" target="_blank">PDF ↗</a>`;
    if (p.links.neurips) html += `<a href="${p.links.neurips}" target="_blank">NeurIPS ↗</a>`;
    html += `</div>`;
    if (p.bibtex) {
      html += `<details>`;
      html += `<summary style="cursor:pointer;color:var(--text-dim)">.bibtex</summary>`;
      html += `<pre>${p.bibtex}</pre>`;
      html += `</details>`;
    }
    html += `</div>`;
  }
  return html;
}

export function renderProjects(knowledge) {
  let html = '<div class="section-title">Selected Builds</div>';
  for (const p of knowledge.projects) {
    html += `<div class="entry">`;
    html += `<div class="title">${p.name}</div>`;
    html += `<div class="meta">${p.type}</div>`;
    html += `<p>${p.description}</p>`;
    html += `<div class="links">`;
    for (const [label, url] of Object.entries(p.links)) {
      html += `<a href="${url}" target="_blank">${label} ↗</a>`;
    }
    html += `</div>`;
    html += `</div>`;
  }
  return html;
}

export function renderCivic(knowledge) {
  const { civic } = knowledge;
  let html = '<div class="section-title">Civic &amp; Policy Work</div>';

  html += `<div class="entry">`;
  html += `<div class="title">${civic.testimony.title}</div>`;
  html += `<div class="meta">Bill: ${civic.testimony.bill}</div>`;
  html += `<div class="meta">Hearing: ${civic.testimony.hearing_body}</div>`;
  html += `<div class="meta">Date: ${civic.testimony.date}</div>`;
  html += `<div class="links">`;
  html += `<a href="${civic.testimony.full_hearing}" target="_blank">Full Hearing ↗</a>`;
  if (civic.testimony.pdf) {
    html += `<a href="${civic.testimony.pdf}" download>Download Testimony PDF ↗</a>`;
  }
  html += `</div>`;
  html += `</div>`;

  html += `<div class="entry">`;
  html += `<div class="title">Contact</div>`;
  html += `<div class="links"><a href="${civic.contact.linkedin}" target="_blank">LinkedIn ↗</a></div>`;
  html += `</div>`;

  return html;
}

export function renderContact(knowledge) {
  const { about } = knowledge;
  let html = '<div class="section-title">Contact</div>';
  html += `<div class="entry">`;
  html += `<div class="meta">Email: <a href="mailto:${about.links.email}">${about.links.email}</a></div>`;
  const linkedinShort = new URL(about.links.linkedin).pathname;
html += `<div class="meta">LinkedIn: <a href="${about.links.linkedin}" target="_blank">${linkedinShort} ↗</a></div>`;
  html += `</div>`;
  return html;
}

export function renderBanner(knowledge) {
  const { about } = knowledge;
  let html = '<div class="banner">';
  html += `<div class="title">Mansur.ai v1.16</div>`;
  html += `<div class="subtitle">${about.tagline}</div>`;
  html += "</div>";
  html += '<div class="section-title">Available Commands</div>';
  html += '<ul class="cmd-list">';
  for (const cmd of commands) {
    html += `<li><span class="cmd">${cmd.trigger}</span> ${cmd.description}</li>`;
  }
  html += "</ul>";
  return html;
}
