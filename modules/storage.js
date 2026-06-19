const STORAGE_KEY = "mansur_ai";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage save failed:", e);
  }
}

export function getHistory() {
  const data = load();
  return data?.history ?? [];
}

export function addHistoryEntry(entry) {
  const data = load() || {};
  data.history = data.history || [];
  data.history.push({ ...entry, timestamp: Date.now() });
  save(data);
}

export function clearHistory() {
  const data = load() || {};
  data.history = [];
  save(data);
}

export function getApiKey() {
  const data = load();
  return data?.apiKey ?? "";
}

export function setApiKey(key) {
  const data = load() || {};
  data.apiKey = key;
  save(data);
}

export function getPref(key, fallback) {
  const data = load();
  return data?.preferences?.[key] ?? fallback;
}

export function setPref(key, value) {
  const data = load() || {};
  data.preferences = data.preferences || {};
  data.preferences[key] = value;
  save(data);
}
