export const SITE = {
  name: "ANORA",
  youtube: "https://youtube.com/@anoramediatv",
};

export type CurrencyCode = "NGN" | "USD";

// Minimum gift per currency (major units). Keeps payment fees from swallowing small gifts.
// Preset buttons are quick picks; donors can always type their own amount.
export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; label: string; min: number; presets: number[] }
> = {
  NGN: { symbol: "₦", label: "Naira", min: 100, presets: [500, 1000, 2000, 5000] },
  USD: { symbol: "$", label: "US Dollar", min: 1, presets: [2, 5, 10, 20] },
};

export const UNLOCK_STORAGE_KEY = "anora:unlocked";
