import { NextRequest, NextResponse } from "next/server";
import { CURRENCIES, type CurrencyCode } from "@/lib/config";
import { getSong } from "@/lib/songs";
import { initializeTransaction } from "@/lib/paystack";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const songId = body?.songId as string | undefined;
  const currency = body?.currency as CurrencyCode | undefined;
  const amount = Number(body?.amount);
  const email = String(body?.email ?? "").trim();

  const song = getSong(songId);
  if (!song) return NextResponse.json({ error: "Unknown song." }, { status: 400 });

  if (!currency || !(currency in CURRENCIES)) {
    return NextResponse.json({ error: "Unsupported currency." }, { status: 400 });
  }
  const cfg = CURRENCIES[currency];

  if (!Number.isFinite(amount) || amount < cfg.min) {
    return NextResponse.json(
      { error: `The minimum gift is ${cfg.symbol}${cfg.min.toLocaleString()}.` },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email for your receipt." }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  try {
    const result = await initializeTransaction({
      email,
      amount: Math.round(amount * 100), // kobo / cents
      currency,
      callbackUrl: `${origin}/unlock`,
      metadata: { songId: song.id },
    });

    if (!result.status) {
      return NextResponse.json(
        { error: result.message || "Could not start the payment." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: result.data.authorization_url });
  } catch {
    return NextResponse.json({ error: "Payment service is unavailable. Please try again." }, { status: 502 });
  }
}
