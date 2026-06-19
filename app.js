import * as Storage from "./modules/storage.js";
import * as Commands from "./modules/commands.js";
import * as Knowledge from "./modules/knowledge.js";
import * as Chat from "./modules/chat.js";
import * as UI from "./modules/ui.js";

let knowledge = null;
let chatHistory = [];
const MAX_HISTORY = 20;

const COMMAND_RENDERERS = {
  renderHelp: (k) => Commands.renderHelp(k),
  renderAbout: (k) => Commands.renderAbout(k),
  renderResearch: (k) => Commands.renderResearch(k),
  renderProjects: (k) => Commands.renderProjects(k),
  renderCivic: (k) => Commands.renderCivic(k),
};

async function init() {
  try {
    knowledge = await Knowledge.loadKnowledge();
    await Commands.loadCommands();
  } catch (err) {
    UI.addLine("error", `Error loading data: ${err.message}`);
    return;
  }

  renderBanner();

  const history = Storage.getHistory();
  for (const entry of history) {
    if (entry.role === "user") {
      UI.addLine("system", `<span style="color:var(--accent)">❯</span> ${UI.renderMarkdown(entry.content)}`);
      chatHistory.push({ role: "user", content: entry.content });
    } else if (entry.role === "assistant") {
      const line = UI.addLine("response", "");
      line.innerHTML = UI.renderMarkdown(entry.content);
      chatHistory.push({ role: "assistant", content: entry.content });
    }
  }

  UI.scrollToBottom();
  UI.focusInput();
}

function renderBanner() {
  const html = Commands.renderBanner(knowledge);
  UI.addLine("system", html);
  UI.addEmptyLine();
}

function buildSystemMessage() {
  return {
    role: "system",
    content: Knowledge.buildSystemPrompt(knowledge),
  };
}

async function handleCommand(input) {
  const cmd = Commands.findCommand(input);
  if (!cmd) {
    UI.addLine("error", `Unknown command: ${input}. Type /help for available commands.`);
    return;
  }

  if (cmd.handler === "clearHistory") {
    clearTerminal();
    return;
  }

  const renderer = COMMAND_RENDERERS[cmd.handler];
  if (renderer) {
    const html = renderer(knowledge);
    const line = UI.addLine("response", html);
    Storage.addHistoryEntry({ role: "assistant", content: html.replace(/<[^>]*>/g, "") });
  }
}

function clearTerminal() {
  UI.clearTerminal();
  Storage.clearHistory();
  chatHistory = [];
  renderBanner();
}

async function handleChat(userMessage) {
  const lineDiv = UI.addLine("response", "");
  lineDiv.classList.add("typing-cursor");

  const messages = [
    buildSystemMessage(),
    ...chatHistory.slice(-MAX_HISTORY),
    { role: "user", content: userMessage },
  ];

  let fullResponse = "";

  Chat.streamChat(
    messages,
    (token) => {
      fullResponse += token;
      const rendered = UI.renderMarkdown(fullResponse);
      lineDiv.innerHTML = rendered;
      UI.scrollToBottom();
    },
    () => {
      lineDiv.classList.remove("typing-cursor");
      UI.scrollToBottom();

      Storage.addHistoryEntry({ role: "user", content: userMessage });
      Storage.addHistoryEntry({ role: "assistant", content: fullResponse });

      chatHistory.push({ role: "user", content: userMessage });
      chatHistory.push({ role: "assistant", content: fullResponse });

      if (chatHistory.length > MAX_HISTORY * 2) {
        chatHistory = chatHistory.slice(-MAX_HISTORY * 2);
      }
    },
    (err) => {
      lineDiv.classList.remove("typing-cursor");
      lineDiv.innerHTML = `<span style="color:var(--error)">Error: ${err}</span>`;
    }
  );
}

async function onSubmit() {
  const raw = UI.getInput();
  if (!raw.trim()) return;

  UI.clearInput();
  UI.addTimestamp();
  UI.addLine("system", `<span style="color:var(--accent)">❯</span> ${raw}`);

  if (Commands.isCommand(raw)) {
    await handleCommand(raw);
  } else {
    await handleChat(raw);
  }

  UI.focusInput();
}

document.addEventListener("DOMContentLoaded", () => {
  init();

  document.getElementById("input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  });

  window.addEventListener("beforeunload", () => {
    Storage.clearHistory();
  });
});
