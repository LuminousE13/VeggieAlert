export type HistoryEntry = { term: string; searchedAt: string };

const KEY = "veggie-alert-history";
const MAX = 50;

export function getHistory(): HistoryEntry[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function addToHistory(term: string) {
    const clean = term.trim();
    if (!clean) return;

    const others = getHistory().filter(
        (entry) => entry.term.toLowerCase() !== clean.toLowerCase()
    );
    const updated = [
        { term: clean, searchedAt: new Date().toISOString() },
        ...others,
    ].slice(0, MAX);

    try {
        localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {
        // when blocked
    }
}

export function clearHistory() {
    try {
        localStorage.removeItem(KEY);
    } catch {}
}