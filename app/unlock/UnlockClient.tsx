"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveUnlocked } from "@/lib/unlocked";

type State =
  | { phase: "checking" }
  | { phase: "error"; message: string }
  | { phase: "ready"; songId: string; title: string; artist: string; url: string };

export default function UnlockClient() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [state, setState] = useState<State>({ phase: "checking" });
  const [attempt, setAttempt] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!reference) {
      setState({ phase: "error", message: "No payment reference found." });
      return;
    }
    let cancelled = false;
    setState({ phase: "checking" });

    fetch(`/api/access?reference=${encodeURIComponent(reference)}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setState({ phase: "error", message: json.error || "We could not confirm this payment." });
          return;
        }
        saveUnlocked(json.songId, reference);
        setState({ phase: "ready", ...json });
      })
      .catch(() => {
        if (!cancelled) setState({ phase: "error", message: "Network problem. Please try again." });
      });

    return () => {
      cancelled = true;
    };
  }, [reference, attempt]);

  async function download() {
    if (!reference || state.phase !== "ready") return;
    setDownloading(true);
    try {
      const res = await fetch(
        `/api/access?reference=${encodeURIComponent(reference)}&song=${state.songId}&download=1`
      );
      const json = await res.json();
      if (res.ok) window.location.href = json.url;
    } finally {
      setDownloading(false);
    }
  }

  if (state.phase === "checking") {
    return <p className="text-anora-mute">Confirming your gift...</p>;
  }

  if (state.phase === "error") {
    return (
      <div>
        <h1 className="text-2xl font-semibold">We could not confirm your payment yet</h1>
        <p className="mt-3 text-anora-mute">{state.message}</p>
        <p className="mt-2 text-sm text-anora-mute">
          If you were charged, wait a moment and try again. Your gift is safe with Paystack.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setAttempt((n) => n + 1)}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black"
          >
            Try again
          </button>
          <Link href="/" className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold">
            Back to songs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-xs uppercase tracking-[0.35em] text-anora-mute">Thank you for your support</div>
      <h1 className="mt-3 text-3xl font-semibold">{state.title}</h1>
      <p className="text-anora-mute">{state.artist}</p>

      <div className="mt-8 rounded-2xl border border-anora-line bg-anora-card p-5">
        <audio controls autoPlay src={state.url} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={download}
          disabled={downloading}
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90 disabled:opacity-60"
        >
          {downloading ? "Preparing..." : "Download"}
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-white"
        >
          Back to songs
        </Link>
      </div>

      <p className="mt-8 text-xs text-anora-mute/70">
        This song stays unlocked on this device. You can return anytime to listen or download again.
      </p>
    </div>
  );
}
