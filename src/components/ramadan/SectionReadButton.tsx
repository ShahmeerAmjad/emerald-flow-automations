import { useAudioPlayer } from "./AudioPlayerProvider";

interface SectionReadButtonProps {
  text: string;
  label: string;
  sectionId?: string;
  juzNumber?: number;
}

export function SectionReadButton({ text, label, sectionId, juzNumber }: SectionReadButtonProps) {
  const { playTrack, pause, currentTrack, isPlaying, isLoading } = useAudioPlayer();

  const trackId = `tts-section-${sectionId || label}`;
  const isThisPlaying = currentTrack?.id === trackId && isPlaying;
  const isThisLoading = currentTrack?.id === trackId && isLoading;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isThisPlaying) {
      pause();
    } else {
      playTrack({
        id: trackId,
        type: "tts",
        text,
        label,
        sectionId,
        juzNumber,
      });
    }
  }

  return (
    <>
      <button
        className={`rc-section-read-btn ${isThisPlaying ? "rc-section-read-active" : ""}`}
        onClick={handleClick}
        title={isThisPlaying ? "Pause" : `Read "${label}" aloud`}
        aria-label={isThisPlaying ? "Pause" : `Read ${label} aloud`}
      >
        {isThisLoading ? (
          <span className="rc-section-read-loading">...</span>
        ) : isThisPlaying ? (
          "⏸"
        ) : (
          "🔊"
        )}
      </button>
      <style>{sectionReadStyles}</style>
    </>
  );
}

const sectionReadStyles = `
  .rc-section-read-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--rc-border);
    background: transparent;
    color: var(--rc-text-muted);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .rc-section-read-btn:hover {
    border-color: var(--rc-gold-dim);
    color: var(--rc-gold);
    background: rgba(201, 168, 76, 0.08);
  }

  .rc-section-read-btn.rc-section-read-active {
    border-color: var(--rc-gold);
    color: var(--rc-gold);
    background: rgba(201, 168, 76, 0.12);
  }

  .rc-section-read-loading {
    font-size: 10px;
    animation: rc-blink-read 1.5s ease-in-out infinite;
  }

  @keyframes rc-blink-read {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  @media (max-width: 480px) {
    .rc-section-read-btn {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }
  }
`;
