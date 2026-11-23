import { UNLOCK_STORAGE_KEY } from "./config";

// Remembers, in this browser only, which payment reference unlocked which song.
// The reference is re-checked with Paystack every time a song is played or downloaded,
// so this is only a bookmark, not proof of payment.
export function readUnlocked(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(UNLOCK_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveUnlocked(songId: string, reference: string) {
  try {
    const all = readUnlocked();
    all[songId] = reference;
    localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable (private window); the unlock page still works for this visit */
  }
}
