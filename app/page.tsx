import SongList from "@/components/SongList";
import { SONGS } from "@/lib/songs";
import { SITE } from "@/lib/config";

export default function Home() {
  // Only send what the browser needs; the storage file path stays on the server.
  const songs = SONGS.map(({ id, title, artist }) => ({ id, title, artist }));

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 pb-16">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/anora-icon.jpg" alt="" width={36} height={36} className="rounded-full" />
          <span className="text-sm font-medium uppercase tracking-brand">{SITE.name}</span>
        </div>
        <a
          href={SITE.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-anora-line px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-white"
        >
          YouTube
        </a>
      </header>

      <section className="py-8 text-center sm:py-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/anora-banner.jpg"
          alt="ANORA"
          className="mx-auto w-full max-w-xl select-none"
          draggable={false}
        />
        <p className="mx-auto mt-8 max-w-md text-balance text-lg font-light leading-relaxed text-white/80">
          Listen to our songs and take them with you. Give any amount as a sign of support for the
          ministry, and the music is yours.
        </p>
      </section>

      <section aria-labelledby="songs-heading">
        <h2
          id="songs-heading"
          className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-anora-mute"
        >
          Songs
        </h2>
        <SongList songs={songs} />
      </section>

      <section className="mt-14 rounded-2xl border border-anora-line bg-anora-card p-8 text-center">
        <h2 className="text-xl font-semibold">Watch ANORA on YouTube</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-anora-mute">
          Videos, worship sessions and more are on our channel.
        </p>
        <a
          href={SITE.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90"
        >
          Visit our channel
        </a>
      </section>

      <footer className="mt-auto pt-14 text-center text-xs uppercase tracking-[0.3em] text-anora-mute/70">
        &copy; {new Date().getFullYear()} {SITE.name}
      </footer>
    </main>
  );
}
