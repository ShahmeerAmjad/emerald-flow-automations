import { useAudioPlayer } from "./AudioPlayerProvider";
import { getAyahAudioUrl } from "@/lib/quran-audio";

interface AyahPlayButtonProps {
  surahNumber: number;
  ayahNumber: number;
  label: string;
}

export function AyahPlayButton({ surahNumber, ayahNumber, label }: AyahPlayButtonProps) {
  const { playTrack, pause, resume, isPlaying, currentTrack, isLoading } =
    useAudioPlayer();

  const trackId = `quran-${surahNumber}:${ayahNumber}`;
  const isThisTrack = currentTrack?.id === trackId;
  const isThisPlaying = isThisTrack && isPlaying;
  const isThisLoading = isThisTrack && isLoading;

  const handleClick = () => {
    if (isThisPlaying) {
      pause();
    } else if (isThisTrack && !isPlaying) {
      resume();
    } else {
      playTrack({
        id: trackId,
        type: "quran",
        url: getAyahAudioUrl(surahNumber, ayahNumber),
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
