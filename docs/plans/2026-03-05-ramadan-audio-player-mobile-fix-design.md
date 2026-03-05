# Ramadan Audio Player + Mobile UX Fix — Design

**Date:** 2026-03-05
**Status:** Approved

## Feature 1: Audio Player + Full Page Reader

### Two Playback Modes

**Mode 1: Verse Player**
- Inline play/pause buttons on each `keyAyat` card and `standoutAyah` card
- Plays individual Quran ayah audio from `verses.quran.com` CDN
- Reciter: Mishary Rashid Alafasy (recitation_id: 7)
- Audio URL pattern: `https://verses.quran.com/Alafasy/mp3/{SSSAAA}.mp3` (e.g., `002255.mp3` for 2:255)

**Mode 2: Listen to Lesson**
- Prominent "Listen to Lesson" button at top of Juz content
- Reads the entire page sequentially, section by section:
  - English text (summaries, teachings, reflections, etc.) → ElevenLabs TTS
  - Quran verses (Arabic recitation) → Alafasy audio from verses.quran.com
- Auto-scrolls and highlights the current section being read
- Seamless hybrid playback switching between TTS voice and Quran recitation

### Components

| Component | Purpose |
|-----------|---------|
| `AudioPlayerProvider` | React context managing playback state, queue, single `<audio>` element, TTS coordination |
| `AyahPlayButton` | Small inline play/pause icon on verse cards |
| `ListenToLessonButton` | Prominent button at page top, queues full page content |
| `MiniPlayer` | Sticky bottom bar: play/pause, skip section, progress, current section label |

### Data Flow

1. Juz JSON already contains `surahNumber` and `ayahNumber` in verse fields
2. Quran audio URLs are deterministic — no runtime API calls needed
3. English text chunked into sections (juzSummary, surah teachings, themes, etc.)
4. ElevenLabs API called per section via Vercel serverless proxy (keeps API key secret)
5. Generated TTS audio cached to minimize API costs (Juz content is static)

### ElevenLabs Integration

- Vercel serverless function at `api/tts.ts` proxies requests to ElevenLabs
- API key stored as Vercel environment variable `ELEVENLABS_API_KEY`
- Voice selection: TBD (user will choose during implementation)
- Client-side utility in `src/lib/elevenlabs.ts` calls the proxy endpoint

### Styling

- Dark theme consistent with existing design (`bg-[#050907]`, amber accents)
- Play buttons use `var(--rc-accent)` amber color
- MiniPlayer: frosted glass effect, ~60px height, slides up when audio starts
- Active section highlight/glow during "Listen to Lesson" mode

---

## Feature 2: Mobile UX Fix (Juz 13+)

### Root Cause

The `rc-reveal` scroll animation uses `IntersectionObserver` with:
- `threshold: 0.1` (10% of element must be visible)
- `rootMargin: "0px 0px -40px 0px"` (element must be 40px inside viewport)

Juz 13+ content is 2-3x longer than Juz 1 (more text per field, more surahs, stories, duas sections). On mobile screens, tall sections never cross the 10% visibility threshold, so they remain at `opacity: 0` — appearing as blank gaps.

### Fix

- Change `threshold` from `0.1` to `0.01`
- Change `rootMargin` from `"0px 0px -40px 0px"` to `"0px 0px 100px 0px"`
- ~2 line change in `JuzDigest.tsx`

---

## Files Overview

### New files
- `src/components/ramadan/AudioPlayerProvider.tsx`
- `src/components/ramadan/MiniPlayer.tsx`
- `src/components/ramadan/AyahPlayButton.tsx`
- `src/components/ramadan/ListenToLessonButton.tsx`
- `src/lib/elevenlabs.ts`
- `api/tts.ts` (Vercel serverless function)

### Modified files
- `src/components/ramadan/JuzDigest.tsx` — add play buttons, fix IntersectionObserver
- `src/pages/RamadanChallenge.tsx` — wrap with AudioPlayerProvider
