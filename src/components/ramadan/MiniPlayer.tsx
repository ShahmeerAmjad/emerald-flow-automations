import { useAudioPlayer } from "./AudioPlayerProvider";

const miniPlayerStyles = `
.rc-miniplayer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 64px;
  background: rgba(10, 15, 13, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--rc-border-glow);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.rc-miniplayer.rc-miniplayer-visible {
  transform: translateY(0);
}

.rc-miniplayer-info {
  flex: 1;
  min-width: 0;
}

.rc-miniplayer-label {
  font-size: 0.9rem;
  color: var(--rc-cream-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Outfit', sans-serif;
}

.rc-miniplayer-position {
  font-size: 0.72rem;
  color: var(--rc-text-muted);
  margin-top: 2px;
}

.rc-miniplayer-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rc-miniplayer-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--rc-cream-soft);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.rc-miniplayer-btn:hover {
  background: rgba(201, 168, 76, 0.15);
  color: var(--rc-gold);
}

.rc-miniplayer-btn-play {
  width: 40px;
  height: 40px;
  background: rgba(201, 168, 76, 0.15);
  border: 1px solid var(--rc-gold-dim);
  color: var(--rc-gold);
  font-size: 18px;
}

.rc-miniplayer-btn-play:hover {
  background: rgba(201, 168, 76, 0.25);
  border-color: var(--rc-gold);
}

.rc-miniplayer-close {
  width: 28px;
  height: 28px;
  font-size: 14px;
  color: var(--rc-text-muted);
}

.rc-miniplayer-close:hover {
  color: var(--rc-cream);
  background: rgba(255, 255, 255, 0.1);
}

.rc-miniplayer-loading {
  font-size: 0.72rem;
  color: var(--rc-gold-dim);
  animation: rc-blink 1.5s ease-in-out infinite;
}

@keyframes rc-blink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

@media (max-width: 480px) {
  .rc-miniplayer {
    height: 56px;
    padding: 0 12px;
    gap: 10px;
  }
  .rc-miniplayer-label { font-size: 0.82rem; }
  .rc-miniplayer-btn { width: 32px; height: 32px; font-size: 14px; }
  .rc-miniplayer-btn-play { width: 36px; height: 36px; font-size: 16px; }
}
`;

export function MiniPlayer() {
  const {
    mode,
    isPlaying,
    currentTrack,
    currentIndex,
    queue,
    isLoading,
    pause,
    resume,
    next,
    previous,
    stop,
  } = useAudioPlayer();

  const isVisible = mode !== "idle";

  return (
    <>
      <div
        className={`rc-miniplayer ${isVisible ? "rc-miniplayer-visible" : ""}`}
      >
        {/* Track info */}
        <div className="rc-miniplayer-info">
          <div className="rc-miniplayer-label">
            {isLoading ? (
              <span className="rc-miniplayer-loading">Loading audio...</span>
            ) : (
              currentTrack?.label || ""
            )}
          </div>
          {mode === "lesson" && queue.length > 1 && (
            <div className="rc-miniplayer-position">
              {currentIndex + 1} of {queue.length}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="rc-miniplayer-controls">
          {mode === "lesson" && (
            <button
              className="rc-miniplayer-btn"
              onClick={previous}
              title="Previous"
            >
              ⏮
            </button>
          )}
          <button
            className="rc-miniplayer-btn rc-miniplayer-btn-play"
            onClick={isPlaying ? pause : resume}
            disabled={isLoading}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          {mode === "lesson" && (
            <button
              className="rc-miniplayer-btn"
              onClick={next}
              title="Next"
            >
              ⏭
            </button>
          )}
        </div>

        {/* Close */}
        <button
          className="rc-miniplayer-btn rc-miniplayer-close"
          onClick={stop}
          title="Close"
        >
          ✕
        </button>
      </div>
      <style>{miniPlayerStyles}</style>
    </>
  );
}
