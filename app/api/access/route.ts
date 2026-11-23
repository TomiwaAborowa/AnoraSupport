import { NextRequest, NextResponse } from "next/server";
import { CURRENCIES, type CurrencyCode } from "@/lib/config";
import { getSong } from "@/lib/songs";
import { verifyTransaction } from "@/lib/paystack";
import { SONGS_BUCKET, supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const LINK_LIFETIME_SECONDS = 60 * 60; // signed links last one hour

// Confirms a payment reference with Paystack, then hands back a short-lived link to the song.
// The audio bucket is private, so there is no permanent public URL to copy or share.
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const reference = params.get("reference");
  const requestedSong = params.get("song");
  const wantsDownload = params.get("download") === "1";

  if (!reference) return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });

  let verified;
  try {
    verified = await verifyTransaction(reference);
  } catch {
    return NextResponse.json({ error: "Could not reach the payment service." }, { status: 502 });
  }

  if (!verified.status || verified.data?.status !== "success") {
    return NextResponse.json({ error: "We could not confirm this payment." }, { status: 402 });
  }

  const paid = verified.data;
  const songId = paid.metadata?.songId;
  if (requestedSong && requestedSong !== songId) {
    return NextResponse.json({ error: "This payment is for a different song." }, { status: 403 });
  }

  const song = getSong(songId);
  if (!song) return NextResponse.json({ error: "Song not found." }, { status: 404 });

  const cfg = CURRENCIES[paid.currency as CurrencyCode];
  if (!cfg || paid.amount < cfg.min * 100) {
    return NextResponse.json({ error: "This payment is below the minimum gift." }, { status: 402 });
  }

  const ext = song.file.includes(".") ? song.file.split(".").pop() : "mp3";
  const { data, error } = await supabaseAdmin()
    .storage.from(SONGS_BUCKET)
    .createSignedUrl(
      song.file,
      LINK_LIFETIME_SECONDS,
      wantsDownload ? { download: `${song.artist} - ${song.title}.${ext}` } : undefined
    );

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: "The song file could not be found. Check that it was uploaded to storage." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    songId: song.id,
    title: song.title,
    artist: song.artist,
    url: data.signedUrl,
  });
}
