"use client";

import { useState } from "react";
import { CURRENCIES, type CurrencyCode } from "@/lib/config";

export type PublicSong = { id: string; title: string; artist: string };

export default function SupportModal({
  song,
  onClose,
}: {
  song: PublicSong;
  onClose: () => void;
}) {
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [amount, setAmount] = useState<string>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cfg = CURRENCIES[currency];

  function switchCurrency(next: CurrencyCode) {
    setCurrency(next);
    setAmount("");
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = Number(amount);
    if (!Number.isFinite(value) || value < cfg.min) {
      setError(`The minimum gift is ${cfg.symbol}${cfg.min.toLocaleString()}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pay/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: song.id, amount: value, currency, email }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network problem. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Support ANORA to unlock ${song.title}`}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-anora-line bg-anora-ink p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-1 text-xs uppercase tracking-[0.3em] text-anora-mute">Support ANORA</div>
        <h2 className="text-2xl font-semibold">{song.title}</h2>
        <p className="mt-2 text-sm text-anora-mute">
          Give any amount as a sign of support, then listen and download as often as you like.
        </p>

        <div className="mt-6 flex gap-2" role="tablist" aria-label="Currency">
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => switchCurrency(c)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                currency === c
                  ? "border-white bg-white text-black"
                  : "border-anora-line text-white hover:border-white/40"
              }`}
            >
              {CURRENCIES[c].symbol} {c}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 min-[400px]:grid-cols-4">
          {cfg.presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={`rounded-lg border px-2 py-2 text-sm transition ${
                amount === String(p)
                  ? "border-white bg-white/10"
                  : "border-anora-line hover:border-white/40"
              }`}
            >
              {cfg.symbol}
              {p.toLocaleString()}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm text-anora-mute" htmlFor="amount">
          Or enter your own amount
        </label>
        <div className="mt-1 flex items-center rounded-lg border border-anora-line bg-black focus-within:border-white">
          <span className="pl-3 text-anora-mute">{cfg.symbol}</span>
          <input
            id="amount"
            inputMode="decimal"
            type="number"
            min={cfg.min}
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`${cfg.min.toLocaleString()} minimum`}
            className="w-full bg-transparent px-2 py-3 outline-none placeholder:text-anora-mute/60"
            required
          />
        </div>

        <label className="mt-4 block text-sm text-anora-mute" htmlFor="email">
          Email for your receipt
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-anora-line bg-black px-3 py-3 outline-none placeholder:text-anora-mute/60 focus:border-white"
          required
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-white py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Opening secure checkout..." : "Give & unlock"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-2 text-sm text-anora-mute hover:text-white"
        >
          Cancel
        </button>
        <p className="mt-3 text-center text-xs text-anora-mute/70">
          Payments are handled securely by Paystack. Cards, bank transfer and international cards accepted.
        </p>
      </form>
    </div>
  );
}
