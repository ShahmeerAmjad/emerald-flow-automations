import { useAudioPlayer, type AudioTrack } from "./AudioPlayerProvider";
import { getAyahAudioUrl } from "@/lib/quran-audio";

interface AyahPlayButtonProps {
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  label: string;
}

export function AyahPlayButton({ surahNumber, ayahStart, ayahEnd, label }: AyahPlayButtonProps) {
  const { playTrack, playLesson, pause, resume, isPlaying, currentTrack, isLoading } =
    useAudioPlayer();

  const trackId = `quran-${surahNumber}:${ayahStart}${ayahEnd !== ayahStart ? `-${ayahEnd}` : ""}`;
  const isThisTrack = currentTrack?.id.startsWith(`quran-${surahNumber}:${ayahStart}`);
  const isThisPlaying = isThisTrack && isPlaying;
  const isThisLoading = isThisTrack && isLoading;

  const handleClick = () => {
    if (isThisPlaying) {
      pause();
    } else if (isThisTrack && !isPlaying) {
      resume();
    } else if (ayahEnd > ayahStart) {
      // Multi-ayah: queue all ayat as a lesson
      const tracks: AudioTrack[] = [];
      for (let a = ayahStart; a <= ayahEnd; a++) {
        tracks.push({
          id: `quran-${surahNumber}:${a}`,
          type: "quran",
          url: getAyahAudioUrl(surahNumber, a),
          label: `${label} (${surahNumber}:${a})`,
        });
      }
      playLesson(tracks);
    } else {
      playTrack({
        id: trackId,
        type: "quran",
        url: getAyahAudioUrl(surahNumber, ayahStart),
        label,
      });
    }
  };

  const icon = isThisLoading ? "..." : isThisPlaying ? "⏸" : "▶";
  const active = isThisPlaying || isThisLoading;

  return (
    <>
      <style>{`
        .ayah-play-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--rc-gold-dim);
          background: rgba(201, 168, 76, 0.1);
          color: var(--rc-gold-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s ease;
          padding: 0;
          line-height: 1;
        }
        .ayah-play-btn:hover {
          background: rgba(201, 168, 76, 0.2);
          border-color: var(--rc-gold);
          color: var(--rc-gold);
        }
        .ayah-play-btn.active {
          background: rgba(201, 168, 76, 0.15);
          border-color: var(--rc-gold);
          color: var(--rc-gold);
        }
      `}</style>
      <button
        className={`ayah-play-btn${active ? " active" : ""}`}
        onClick={handleClick}
        aria-label={isThisPlaying ? `Pause ${label}` : `Play ${label}`}
        title={isThisPlaying ? `Pause ${label}` : `Play ${label}`}
      >
        {icon}
      </button>
    </>
  );
}
