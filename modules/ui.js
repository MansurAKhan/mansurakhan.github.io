const output = document.getElementById("output");
const input = document.getElementById("input");
const prompt = document.getElementById("prompt");

export function focusInput() {
  input.focus();
}

export function getInput() {
  return input.value;
}

export function clearInput() {
  input.value = "";
}

export function setPromptSuffix(suffix) {
  prompt.textContent = `mansur.ai:~$${suffix}`;
}

export function addLine(className, content) {
  const div = document.createElement("div");
  div.className = `line ${className}`;
  div.innerHTML = content;
  output.appendChild(div);
  scrollToBottom();
  return div;
}

export function addEmptyLine() {
  const div = document.createElement("div");
  div.className = "line";
  div.innerHTML = "&nbsp;";
  output.appendChild(div);
  scrollToBottom();
  return div;
}

export function addTimestamp() {
  const now = new Date();
  const ts = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  addLine("timestamp", `[${ts}]`);
}

export function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

let currentTypewriter = null;

export function cancelTypewriter() {
  if (currentTypewriter) {
    clearTimeout(currentTypewriter);
    currentTypewriter = null;
  }
}

export function typewriter(container, text, speed = 10, onDone) {
  cancelTypewriter();
  container.innerHTML = "";
  let i = 0;

  function tick() {
    if (i >= text.length) {
      if (onDone) onDone();
      return;
    }
    container.innerHTML += text[i];
    i++;
    scrollToBottom();
    currentTypewriter = setTimeout(tick, speed);
  }

  tick();
}

export function appendTyped(container, text, speed = 10) {
  let i = 0;

  function tick() {
    if (i >= text.length) return;
    container.innerHTML += text[i];
    i++;
    scrollToBottom();
    currentTypewriter = setTimeout(tick, speed);
  }

  tick();
}

export function renderMarkdown(content) {
  if (typeof marked !== "undefined") {
    return marked.parse(content, { breaks: true });
  }
  return content.replace(/\n/g, "<br>");
}

export function clearTerminal() {
  output.innerHTML = "";
}

export function showModal() {
  document.getElementById("key-modal").classList.remove("hidden");
  document.getElementById("key-input").focus();
}

export function hideModal() {
  document.getElementById("key-modal").classList.add("hidden");
  focusInput();
}

export function showModalError(msg) {
  document.getElementById("key-error").textContent = msg;
}

export function getKeyInput() {
  return document.getElementById("key-input").value.trim();
}

export function clearKeyInput() {
  document.getElementById("key-input").value = "";
  document.getElementById("key-error").textContent = "";
}

export function disableInput(disabled) {
  input.disabled = disabled;
}
