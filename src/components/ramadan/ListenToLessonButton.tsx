import { useCallback } from "react";
import { useAudioPlayer, type AudioTrack } from "./AudioPlayerProvider";
import { getAyahAudioUrl, parseVerseReference } from "@/lib/quran-audio";
import type { JuzDigest } from "@/types/ramadan";

interface ListenToLessonButtonProps {
  digest: JuzDigest;
}

function buildPlaylist(digest: JuzDigest): AudioTrack[] {
  const tracks: AudioTrack[] = [];
  const juz = digest.juzNumber;

  // 1. Juz Summary (TTS)
  tracks.push({
    id: "tts-summary",
    type: "tts",
    text: digest.juzSummary,
    label: "Juz Summary",
    sectionId: "section-summary",
    juzNumber: juz,
  });

  // 2. Surah breakdowns
  digest.surahBreakdowns.forEach((surah, i) => {
    // TTS: combined surah content
    const ttsText = [
      surah.revelationContext,
      surah.coreTheme,
      surah.keyTeachings.join("\n"),
    ].join("\n\n");

    tracks.push({
      id: `tts-surah-${i}`,
      type: "tts",
      text: ttsText,
      label: surah.name,
      sectionId: `section-surah-${i}`,
      juzNumber: juz,
    });

    // Quran: standout ayah
    const parsed = parseVerseReference(surah.standoutAyah.verseNumber);
    if (parsed) {
      tracks.push({
        id: `quran-standout-${i}`,
        type: "quran",
        url: getAyahAudioUrl(parsed.surah, parsed.ayahStart),
        label: `Standout Ayah - ${surah.standoutAyah.surahName}`,
        sectionId: `section-surah-${i}`,
      });
      // Queue remaining ayat if it's a range
      for (let a = parsed.ayahStart + 1; a <= parsed.ayahEnd; a++) {
        tracks.push({
          id: `quran-standout-${i}-${a}`,
          type: "quran",
          url: getAyahAudioUrl(parsed.surah, a),
          label: `Standout Ayah - ${surah.standoutAyah.surahName} (${parsed.surah}:${a})`,
          sectionId: `section-surah-${i}`,
        });
      }
    }
  });

  // 3. Connecting the Dots (TTS)
  tracks.push({
    id: "tts-connecting",
    type: "tts",
    text: digest.connectingTheDots,
    label: "Connecting the Dots",
    sectionId: "section-connecting",
    juzNumber: juz,
  });

  // 4. Core themes (TTS)
  digest.coreThemes.forEach((theme, i) => {
    tracks.push({
      id: `tts-theme-${i}`,
      type: "tts",
      text: `${theme.name}. ${theme.explanation}\n\n${theme.dailyRelevance}`,
      label: theme.name,
      sectionId: `section-theme-${i}`,
      juzNumber: juz,
    });
  });

  // 5. Key ayat (Quran audio)
  digest.keyAyat.forEach((ayah, i) => {
    const parsed = parseVerseReference(ayah.reference);
    if (parsed) {
      tracks.push({
        id: `quran-ayah-${i}`,
        type: "quran",
        url: getAyahAudioUrl(parsed.surah, parsed.ayahStart),
        label: ayah.reference,
        sectionId: `section-ayah-${i}`,
      });
      // Queue remaining ayat if it's a range
      for (let a = parsed.ayahStart + 1; a <= parsed.ayahEnd; a++) {
        tracks.push({
          id: `quran-ayah-${i}-${a}`,
          type: "quran",
          url: getAyahAudioUrl(parsed.surah, a),
          label: `${ayah.reference} (${parsed.surah}:${a})`,
          sectionId: `section-ayah-${i}`,
        });
      }
    }
  });

  // 6. Hadith (TTS)
  tracks.push({
    id: "tts-hadith",
    type: "tts",
    text: `${digest.hadithOfTheDay.text}\n\n${digest.hadithOfTheDay.reflection}`,
    label: "Hadith of the Day",
    sectionId: "section-hadith",
    juzNumber: juz,
  });

  // 7. Daily practice (TTS)
  tracks.push({
    id: "tts-practice",
    type: "tts",
    text: digest.dailyPractice,
    label: "Daily Practice",
    sectionId: "section-practice",
    juzNumber: juz,
  });

  // 8. Habit check-in + closing (TTS)
  tracks.push({
    id: "tts-closing",
    type: "tts",
    text: `${digest.habitCheckIn}\n\n${digest.closingMessage}`,
    label: "Habit Check-In & Closing",
    sectionId: "section-habit",
    juzNumber: juz,
  });

  return tracks;
}

export function ListenToLessonButton({ digest }: ListenToLessonButtonProps) {
  const { mode, isPlaying, pause, resume, playLesson } = useAudioPlayer();

  const handleClick = useCallback(() => {
    if (mode === "lesson" && isPlaying) {
      pause();
    } else if (mode === "lesson" && !isPlaying) {
      resume();
    } else {
      const tracks = buildPlaylist(digest);
      playLesson(tracks);
    }
  }, [mode, isPlaying, pause, resume, playLesson, digest]);

  const isListening = mode === "lesson";

  return (
    <>
      <style>{`
        .rc-listen-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          max-width: 720px;
          margin: 0 auto 32px;
          padding: 16px 32px;
          background: linear-gradient(135deg, var(--rc-emerald), #1a6a4a);
          color: var(--rc-cream);
          border: 1px solid rgba(26, 122, 90, 0.4);
          border-radius: 60px;
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.03em;
        }

        .rc-listen-btn:hover {
          background: linear-gradient(135deg, #1f8a68, #1a7a5a);
          border-color: var(--rc-emerald-light);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(26, 122, 90, 0.3);
        }

        .rc-listen-btn.rc-listening {
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(26, 122, 90, 0.15));
          border-color: var(--rc-gold-dim);
          animation: rc-pulse-listen 2s ease-in-out infinite;
        }

        @keyframes rc-pulse-listen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.2); }
          50% { box-shadow: 0 0 0 8px rgba(201, 168, 76, 0); }
        }
      `}</style>
      <button
        className={`rc-listen-btn${isListening ? " rc-listening" : ""}`}
        onClick={handleClick}
      >
        {isListening ? "\u23F8 Listening..." : "\uD83C\uDFA7 Listen to This Lesson"}
      </button>
    </>
  );
}
