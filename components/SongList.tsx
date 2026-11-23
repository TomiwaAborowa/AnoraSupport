"use client";

import { useEffect, useState } from "react";
import SupportModal, { type PublicSong } from "./SupportModal";
import { readUnlocked } from "@/lib/unlocked";

export default function SongList({ songs }: { songs: PublicSong[] }) {
  const [unlocked, setUnlocked] = useState<Record<string, string>>({});
  const [modalSong, setModalSong] = useState<PublicSong | null>(null);
  const [playing, setPlaying] = useState<{ songId: string; url: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ songId: string; message: string } | null>(null);

  useEffect(() => {
    setUnlocked(readUnlocked());
  }, []);

  async function getLink(song: PublicSong, download: boolean): Promise<string | null> {
    const reference = unlocked[song.id];
    setBusy(song.id);
    setError(null);
    try {
      const res = await fetch(
        `/api/access?reference=${encodeURIComponent(reference)}&song=${song.id}${download ? "&download=1" : ""}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError({ songId: song.id, message: json.error || "Could not open this song." });
        return null;
      }
      return json.url as string;
    } catch {
      setError({ songId: song.id, message: "Network problem. Please try again." });
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function play(song: PublicSong) {
    const url = await getLink(song, false);
    if (url) setPlaying({ songId: song.id, url });
  }

  async function download(song: PublicSong) {
    const url = await getLink(song, true);
    if (url) window.location.href = url;
  }

  return (
    <>
      <ul className="space-y-3">
        {songs.map((song, i) => {
          const isUnlocked = Boolean(unlocked[song.id]);
          const isBusy = busy === song.id;
          return (
            <li
              key={song.id}
              className="glow-hover rounded-2xl border border-anora-line bg-anora-card p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-anora-line text-sm text-anora-mute">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-lg font-medium">{song.title}</div>
                  <div className="text-sm text-anora-mute">{song.artist}</div>
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                  {isUnlocked ? (
                    <>
                      <button
                        onClick={() => play(song)}
                        disabled={isBusy}
                        className="flex-1 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60 sm:flex-none"
                      >
                        {isBusy ? "..." : "Listen"}
                      </button>
                      <button
                        onClick={() => download(song)}
                        disabled={isBusy}
                        className="flex-1 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold transition hover:border-white disabled:opacity-60 sm:flex-none"
                      >
                        Download
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setModalSong(song)}
                        className="flex-1 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 sm:flex-none"
                      >
                        Listen
                      </button>
                      <button
                        onClick={() => setModalSong(song)}
                        className="flex-1 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold transition hover:border-white sm:flex-none"
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
              </div>

              {playing?.songId === song.id && (
                <div className="mt-4">
                  <audio controls autoPlay src={playing.url} />
                </div>
              )}

              {error?.songId === song.id && (
                <p className="mt-3 text-sm text-red-400">{error.message}</p>
              )}
            </li>
          );
        })}
      </ul>

      {modalSong && <SupportModal song={modalSong} onClose={() => setModalSong(null)} />}
    </>
  );
}
