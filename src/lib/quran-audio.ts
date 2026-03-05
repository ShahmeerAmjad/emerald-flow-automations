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
 * Parses a verse reference string like "2:255" or "Surah Al-Baqarah, 2:255"
 * into { surah, ayah } numbers.
 */
export function parseVerseReference(ref: string): { surah: number; ayah: number } | null {
  const match = ref.match(/(\d+):(\d+)/);
  if (!match) return null;
  return { surah: parseInt(match[1]), ayah: parseInt(match[2]) };
}
