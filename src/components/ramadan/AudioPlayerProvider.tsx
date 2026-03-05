import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────────────

export interface AudioTrack {
  id: string;
  type: "quran" | "tts";
  url?: string;
  text?: string;
  label: string;
  sectionId?: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentIndex: number;
  queue: AudioTrack[];
  mode: "idle" | "single" | "lesson";
  isLoading: boolean;
}

export interface AudioPlayerContextType extends AudioPlayerState {
  playTrack: (track: AudioTrack) => void;
  playLesson: (tracks: AudioTrack[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  stop: () => void;
}

// ── Context & Hook ─────────────────────────────────────────────────

export const AudioPlayerContext =
  createContext<AudioPlayerContextType | null>(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx)
    throw new Error(
      "useAudioPlayer must be used within AudioPlayerProvider"
    );
  return ctx;
}

// ── Helpers ────────────────────────────────────────────────────────

async function getTtsAudio(text: string): Promise<string> {
  const { fetchTtsAudio } = await import("@/lib/elevenlabs");
  return fetchTtsAudio(text);
}

const ACTIVE_CLASS = "rc-audio-active";

function clearActiveHighlight() {
  document
    .querySelectorAll(`.${ACTIVE_CLASS}`)
    .forEach((el) => el.classList.remove(ACTIVE_CLASS));
}

function highlightSection(sectionId?: string) {
  clearActiveHighlight();
  if (!sectionId) return;
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add(ACTIVE_CLASS);
  }
}

// ── Initial state ──────────────────────────────────────────────────

const INITIAL_STATE: AudioPlayerState = {
  isPlaying: false,
  currentTrack: null,
  currentIndex: 0,
  queue: [],
  mode: "idle",
  isLoading: false,
};

// ── Provider ───────────────────────────────────────────────────────

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>(INITIAL_STATE);
  const blobUrlRef = useRef<string | null>(null);
  const loadGenRef = useRef(0); // generation counter for stale request detection

  // Revoke previous blob URL to avoid memory leaks
  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  // Core function to load and play a single track
  // Uses generation counter to prevent stale async results from corrupting state
  const loadAndPlay = useCallback(
    async (track: AudioTrack) => {
      const gen = ++loadGenRef.current;
      const audio = audioRef.current;
      if (!audio) return;

      // Pause any currently playing audio before switching
      audio.pause();
      revokeBlobUrl();

      if (track.type === "quran" && track.url) {
        audio.src = track.url;
        setState((s) => ({ ...s, isLoading: false, currentTrack: track }));
        audio.play()
          .then(() => {
            if (gen !== loadGenRef.current) return;
            setState((s) => ({ ...s, isPlaying: true }));
          })
          .catch(() => {
            if (gen !== loadGenRef.current) return;
            setState((s) => ({ ...s, isPlaying: false }));
          });
      } else if (track.type === "tts" && track.text) {
        setState((s) => ({ ...s, isLoading: true, currentTrack: track }));
        try {
          const blobUrl = await getTtsAudio(track.text);
          // Check if this request is still current
          if (gen !== loadGenRef.current) {
            URL.revokeObjectURL(blobUrl);
            return;
          }
          blobUrlRef.current = blobUrl;
          audio.src = blobUrl;
          setState((s) => ({ ...s, isLoading: false }));
          audio.play()
            .then(() => {
              if (gen !== loadGenRef.current) return;
              setState((s) => ({ ...s, isPlaying: true }));
            })
            .catch(() => {
              if (gen !== loadGenRef.current) return;
              setState((s) => ({ ...s, isPlaying: false }));
            });
        } catch {
          if (gen !== loadGenRef.current) return;
          setState((s) => ({ ...s, isLoading: false, isPlaying: false }));
        }
      }

      // Highlight section for lesson mode
      highlightSection(track.sectionId);
    },
    [revokeBlobUrl]
  );

  // ── Internal: reset to idle ────────────────────────────────────

  const resetToIdle = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    revokeBlobUrl();
    clearActiveHighlight();
    setState(INITIAL_STATE);
  }, [revokeBlobUrl]);

  // ── Public API ───────────────────────────────────────────────────

  const playTrack = useCallback(
    (track: AudioTrack) => {
      setState((s) => ({
        ...s,
        mode: "single",
        queue: [track],
        currentIndex: 0,
        currentTrack: track,
      }));
      loadAndPlay(track);
    },
    [loadAndPlay]
  );

  const playLesson = useCallback(
    (tracks: AudioTrack[]) => {
      if (tracks.length === 0) return;
      setState((s) => ({
        ...s,
        mode: "lesson",
        queue: tracks,
        currentIndex: 0,
        currentTrack: tracks[0],
      }));
      loadAndPlay(tracks[0]);
    },
    [loadAndPlay]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play()
      .then(() => setState((s) => ({ ...s, isPlaying: true })))
      .catch(() => setState((s) => ({ ...s, isPlaying: false })));
  }, []);

  const stop = useCallback(() => {
    resetToIdle();
  }, [resetToIdle]);

  const next = useCallback(() => {
    // Read state synchronously via setState, but perform side effects outside
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.queue.length) {
        // Schedule reset after state update
        queueMicrotask(() => resetToIdle());
        return prev; // resetToIdle will set INITIAL_STATE
      }
      const nextTrack = prev.queue[nextIndex];
      // Schedule playback after state update
      queueMicrotask(() => loadAndPlay(nextTrack));
      return {
        ...prev,
        currentIndex: nextIndex,
        currentTrack: nextTrack,
      };
    });
  }, [loadAndPlay, resetToIdle]);

  const previous = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) {
        // Restart current track — schedule outside setState
        queueMicrotask(() => {
          const audio = audioRef.current;
          if (audio) {
            audio.currentTime = 0;
            audio.play()
              .then(() => setState((s) => ({ ...s, isPlaying: true })))
              .catch(() => {});
          }
        });
        return prev;
      }
      const prevIndex = prev.currentIndex - 1;
      const prevTrack = prev.queue[prevIndex];
      // Schedule playback after state update
      queueMicrotask(() => loadAndPlay(prevTrack));
      return {
        ...prev,
        currentIndex: prevIndex,
        currentTrack: prevTrack,
      };
    });
  }, [loadAndPlay]);

  // ── Audio ended handler ──────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      setState((prev) => {
        if (prev.mode === "lesson" && prev.currentIndex + 1 < prev.queue.length) {
          const nextIndex = prev.currentIndex + 1;
          const nextTrack = prev.queue[nextIndex];
          // Schedule playback outside setState
          queueMicrotask(() => loadAndPlay(nextTrack));
          return {
            ...prev,
            currentIndex: nextIndex,
            currentTrack: nextTrack,
          };
        }
        // Single mode or end of lesson — reset
        queueMicrotask(() => {
          revokeBlobUrl();
          clearActiveHighlight();
        });
        return INITIAL_STATE;
      });
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [loadAndPlay, revokeBlobUrl]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      revokeBlobUrl();
    };
  }, [revokeBlobUrl]);

  // ── Render ───────────────────────────────────────────────────────

  const contextValue: AudioPlayerContextType = {
    ...state,
    playTrack,
    playLesson,
    pause,
    resume,
    next,
    previous,
    stop,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
      <audio ref={audioRef} />
    </AudioPlayerContext.Provider>
  );
}
