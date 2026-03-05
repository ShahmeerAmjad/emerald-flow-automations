// src/lib/quran-audio.ts

/**
 * Builds a direct CDN URL for per-ayah Quran audio.
 * Reciter: Mishary Rashid Alafasy
 * CDN: verses.quran.com (BunnyCDN)
 */
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const surah = String(surahNumber).padStart(3, "0");
  const ayah = String(ayahNumber).padStart(3, "0");
  return `https://verses.quran.com/Alafasy/mp3/${surah}${ayah}.mp3`;
}

/**
 * Parses a verse reference string like "2:255", "20:25-28", or "Surah Al-Baqarah, 2:255"
 * into { surah, ayahStart, ayahEnd } numbers.
 */
export function parseVerseReference(ref: string): { surah: number; ayahStart: number; ayahEnd: number } | null {
  // Match "X:Y" or "X:Y-Z"
  const match = ref.match(/(\d+):(\d+)(?:-(\d+))?/);
  if (!match) return null;
  const surah = parseInt(match[1]);
  const ayahStart = parseInt(match[2]);
  const ayahEnd = match[3] ? parseInt(match[3]) : ayahStart;
  return { surah, ayahStart, ayahEnd };
}
