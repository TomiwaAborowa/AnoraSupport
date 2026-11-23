export type Song = {
  id: string;
  title: string;
  artist: string;
  /** File path inside the private Supabase Storage bucket (SUPABASE_SONGS_BUCKET). */
  file: string;
};

// PLACEHOLDERS: replace these with ANORA's real songs.
// 1) Upload each audio file to the private "songs" bucket in Supabase Storage.
// 2) Put the same file name in `file` below.
// Keep each `id` short, lowercase and stable: it is what a payment gets tied to.
export const SONGS: Song[] = [
  { id: "song-one", title: "Epic", artist: "ANORA", file: "epic.wav" },
  { id: "song-two", title: "Song Title Two", artist: "ANORA", file: "song-two.mp3" },
  { id: "song-three", title: "Song Title Three", artist: "ANORA", file: "song-three.mp3" },
];

export function getSong(id: string | undefined | null): Song | undefined {
  return SONGS.find((s) => s.id === id);
}
