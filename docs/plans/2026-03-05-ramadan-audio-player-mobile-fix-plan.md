# Ramadan Audio Player + Mobile UX Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add per-ayah audio playback + full "Listen to Lesson" TTS reader to the Ramadan Juz day pages, and fix the mobile invisible-section bug for Juz 13+.

**Architecture:** A React context (`AudioPlayerProvider`) wraps the day page and manages two playback modes — individual Quran verse audio from `verses.quran.com` CDN, and full-page sequential reading via ElevenLabs TTS for English + Alafasy for Arabic. A sticky `MiniPlayer` bar at the bottom provides playback controls. The mobile UX fix is a 2-line IntersectionObserver config change.

**Tech Stack:** React 18, TypeScript, Vite, Vercel serverless functions, ElevenLabs TTS API, Quran.com audio CDN

---

### Task 1: Fix Mobile IntersectionObserver Bug

**Files:**
- Modify: `src/components/ramadan/JuzDigest.tsx:26`

**Step 1: Fix the IntersectionObserver config**

In `JuzDigest.tsx`, line 26, change:
```tsx
{ threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
```
to:
```tsx
{ threshold: 0.01, rootMargin: "0px 0px 100px 0px" }
```

**Step 2: Verify build passes**

Run: `npx tsc --noEmit && npm run build`
Expected: Both pass with no errors.

**Step 3: Commit**

```bash
git add src/components/ramadan/JuzDigest.tsx
git commit -m "fix: improve scroll reveal on mobile for long Juz content

Lower IntersectionObserver threshold from 0.1 to 0.01 and change
rootMargin to trigger 100px before viewport entry. Fixes invisible
sections on Juz 13+ where tall content never crossed the 10% threshold."
```

---

### Task 2: Create Audio URL Utility

**Files:**
- Create: `src/lib/quran-audio.ts`

**Step 1: Create the utility**

```ts
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
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/lib/quran-audio.ts
git commit -m "feat: add Quran audio URL utility for per-ayah playback"
```

---

### Task 3: Create AudioPlayerProvider Context

**Files:**
- Create: `src/components/ramadan/AudioPlayerProvider.tsx`

**Step 1: Build the context and provider**

This component manages:
- A single `<audio>` element for Quran verse playback
- A playlist queue (array of `{ id, type, url?, text?, label }`)
- Play/pause/skip/previous controls
- Current track index and playback state
- "Listen to Lesson" mode that builds the full page queue

Key types and context shape:

```tsx
export interface AudioTrack {
  id: string;
  type: "quran" | "tts";
  url?: string;        // Direct URL for quran tracks
  text?: string;        // Text content for TTS tracks
  label: string;        // Display label in MiniPlayer (e.g., "Surah Al-Baqarah 2:255")
  sectionId?: string;   // DOM id for auto-scroll/highlight
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
```

Implementation details:
- Use `useRef<HTMLAudioElement>` for the audio element
- On `playTrack()` for quran: set `audio.src = track.url` and play
- On `playTrack()` for TTS: fetch audio from `/api/tts` endpoint, then play the blob URL
- On track end (`onended`), advance to next track in queue
- When `mode === "lesson"`, auto-scroll the `sectionId` element into view with `scrollIntoView({ behavior: "smooth", block: "center" })`
- Add/remove `rc-audio-active` CSS class on the current section's DOM element for highlight glow

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/ramadan/AudioPlayerProvider.tsx
git commit -m "feat: add AudioPlayerProvider context for Quran + TTS playback"
```

---

### Task 4: Create ElevenLabs TTS Proxy (Vercel Serverless)

**Files:**
- Create: `api/tts.ts`

**Step 1: Create the serverless function**

```ts
// api/tts.ts — Vercel serverless function
// Proxies text-to-speech requests to ElevenLabs, keeping API key server-side

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TTS not configured" });
  }

  const { text, voiceId } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text is required" });
  }

  // Default voice — will be updated after user picks voice
  const voice = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Rachel (default)

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return res.status(response.status).json({ error: err });
  }

  const audioBuffer = await response.arrayBuffer();
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "public, max-age=604800"); // Cache 7 days — content is static
  res.send(Buffer.from(audioBuffer));
}
```

**Step 2: Update vercel.json to allow both SPA rewrites and API routes**

The current vercel.json rewrites everything to `/index.html`. We need API routes to pass through. Change to:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Step 3: Install @vercel/node types**

Run: `npm install --save-dev @vercel/node`

**Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS (serverless functions are deployed separately by Vercel, not bundled by Vite)

Note: If tsc complains about the api/ directory, it may need to be excluded from the main tsconfig. Check `tsconfig.json` — if `include` is set, api/ may be outside it already. If not, add `"exclude": ["api"]`.

**Step 5: Commit**

```bash
git add api/tts.ts vercel.json package.json package-lock.json
git commit -m "feat: add ElevenLabs TTS serverless proxy at /api/tts"
```

---

### Task 5: Create ElevenLabs Client Utility

**Files:**
- Create: `src/lib/elevenlabs.ts`

**Step 1: Create the client**

```ts
// src/lib/elevenlabs.ts

/**
 * Fetches TTS audio from the /api/tts proxy endpoint.
 * Returns a blob URL that can be set as audio.src.
 */
export async function fetchTtsAudio(text: string, voiceId?: string): Promise<string> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voiceId }),
  });

  if (!res.ok) {
    throw new Error(`TTS failed: ${res.status}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/lib/elevenlabs.ts
git commit -m "feat: add ElevenLabs TTS client utility"
```

---

### Task 6: Create AyahPlayButton Component

**Files:**
- Create: `src/components/ramadan/AyahPlayButton.tsx`

**Step 1: Build the component**

A small inline play/pause icon button. When tapped, it plays the specific ayah via the AudioPlayerContext.

Props:
- `surahNumber: number`
- `ayahNumber: number`
- `label: string` (display name like "Al-Baqarah 2:255")

Uses `useAudioPlayer()` from the context to call `playTrack()` with a quran-type track. Shows a play icon (▶) when idle, pause icon (⏸) when this specific track is playing, and a small loading spinner when buffering.

Styling:
- 28x28px circle button
- `background: transparent`, `border: 1px solid var(--rc-gold-dim)`
- On hover: `border-color: var(--rc-gold)`, `color: var(--rc-gold)`
- Positioned absolutely at top-right of the ayah card (use CSS)
- On mobile: slightly larger hit target (36x36px)

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/ramadan/AyahPlayButton.tsx
git commit -m "feat: add inline AyahPlayButton for per-verse audio"
```

---

### Task 7: Create ListenToLessonButton Component

**Files:**
- Create: `src/components/ramadan/ListenToLessonButton.tsx`

**Step 1: Build the component**

Props:
- `digest: JuzDigestType` — the full Juz data to build the playlist from

This component:
1. Builds a sequential playlist from the digest data:
   - TTS track: juzSummary
   - For each surahBreakdown:
     - TTS track: revelationContext + coreTheme + keyTeachings
     - Quran track: standoutAyah (parsed from verseNumber)
   - TTS track: connectingTheDots
   - For each coreTheme: TTS track
   - For each keyAyah: Quran track (parsed from reference)
   - TTS track: hadith text + reflection
   - TTS track: dailyPractice
   - TTS track: habitCheckIn + closingMessage
2. Calls `playLesson(tracks)` on the context

Styling:
- Full-width button within `rc-container`
- `background: linear-gradient(135deg, var(--rc-emerald), #1a6a4a)`
- `color: var(--rc-cream)`, `border-radius: 60px`, `padding: 16px 32px`
- Headphones icon (🎧) + "Listen to This Lesson" text
- When playing, changes to "Listening..." with a pulsing animation
- Placed right after the Day Header, before Juz Summary

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/ramadan/ListenToLessonButton.tsx
git commit -m "feat: add Listen to Lesson button with full-page playlist builder"
```

---

### Task 8: Create MiniPlayer Component

**Files:**
- Create: `src/components/ramadan/MiniPlayer.tsx`

**Step 1: Build the component**

Reads from `useAudioPlayer()` context. Only renders when `mode !== "idle"`.

Layout (bottom sticky bar):
- Fixed to bottom of viewport, `z-index: 50`
- Height: 64px, `backdrop-filter: blur(20px)`, `background: rgba(15, 26, 21, 0.92)`
- Border-top: `1px solid var(--rc-border-glow)`
- Slides up with CSS transition when appearing

Content (left to right):
- **Section label**: current track's `label` (truncated to ~30 chars on mobile)
- **Controls**: previous (⏮), play/pause (▶/⏸), next (⏭) — 32px icon buttons
- **Close button**: ✕ to stop and dismiss

On mobile (≤480px):
- Label truncated more aggressively
- Controls stay centered
- 56px height

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/ramadan/MiniPlayer.tsx
git commit -m "feat: add sticky MiniPlayer bar for audio playback controls"
```

---

### Task 9: Integrate Audio Components into JuzDigest

**Files:**
- Modify: `src/components/ramadan/JuzDigest.tsx`

**Step 1: Add AyahPlayButton to verse cards**

Import `AyahPlayButton` and add it to:

1. **Each `keyAyat` card** (lines 116-125): Add `AyahPlayButton` inside the `.rc-ayah-card` div. Parse `ayah.reference` to get surah/ayah numbers using `parseVerseReference()`.

2. **Each `standoutAyah` card** in `SurahBlock` (lines 275-288): Add `AyahPlayButton` inside the `.rc-ayah-card` div. Use `surah.standoutAyah.verseNumber`.

3. **Each `dailyDuas` card** (lines 160-172): Add `AyahPlayButton` for dua audio. Parse `dua.reference`.

Make the `.rc-ayah-card` container `position: relative` so the absolutely-positioned play button sits correctly.

**Step 2: Add CSS for play button positioning**

Add to `digestStyles`:
```css
.rc-ayah-card {
  position: relative;
}
```

**Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/ramadan/JuzDigest.tsx
git commit -m "feat: add inline play buttons to all verse and dua cards"
```

---

### Task 10: Integrate AudioPlayerProvider + ListenToLessonButton + MiniPlayer into RamadanDay

**Files:**
- Modify: `src/pages/RamadanDay.tsx`

**Step 1: Wrap page content with AudioPlayerProvider**

Import `AudioPlayerProvider`, `ListenToLessonButton`, and `MiniPlayer`.

Wrap the `<main>` content inside `<AudioPlayerProvider>`:

```tsx
<AudioPlayerProvider>
  <main className="ramadan-content" style={{ paddingTop: "24px" }}>
    {digest && unlocked ? (
      <>
        <ListenToLessonButton digest={digest} />
        <JuzDigest digest={digest} />
        {/* ... prev/next nav ... */}
      </>
    ) : (
      /* ... locked state ... */
    )}
  </main>
  <MiniPlayer />
</AudioPlayerProvider>
```

**Step 2: Add section IDs to JuzDigest sections**

Go back to `JuzDigest.tsx` and add `id` attributes to each `RcSection` and major content block so the auto-scroll can target them:
- `id="section-summary"`
- `id={`section-surah-${i}`}`
- `id="section-connecting"`
- `id={`section-theme-${i}`}`
- `id={`section-ayah-${i}`}`
- `id="section-hadith"`
- `id="section-practice"`
- `id="section-habit"`

**Step 3: Add active section highlight CSS**

Add to `digestStyles`:
```css
.rc-audio-active {
  box-shadow: 0 0 0 2px var(--rc-gold-dim), 0 0 20px rgba(201, 168, 76, 0.15);
  transition: box-shadow 0.3s ease;
}
```

**Step 4: Add bottom padding for MiniPlayer**

When MiniPlayer is visible, page content needs extra bottom padding so the last section isn't hidden behind it. Add to `.ramadan-content` or to the digest container:
```css
.ramadan-content:has(~ .rc-miniplayer-visible) {
  padding-bottom: 80px;
}
```

If `:has()` isn't supported broadly enough, use a class toggle approach via the context.

**Step 5: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

**Step 6: Manual test**

Run: `npm run dev`
- Navigate to `/ramadan/1`
- Verify play buttons appear on verse cards
- Click a play button — should hear Alafasy recitation
- MiniPlayer should slide up from bottom
- Click "Listen to Lesson" — should start reading the full page
- On mobile viewport (Chrome DevTools): verify sections are all visible for Juz 13+

**Step 7: Commit**

```bash
git add src/pages/RamadanDay.tsx src/components/ramadan/JuzDigest.tsx
git commit -m "feat: integrate audio player, listen-to-lesson, and mini player into day pages"
```

---

### Task 11: Final Verification & Push

**Step 1: Full build check**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

**Step 2: Push to main**

```bash
git push origin main
```

This triggers Vercel auto-deploy.

**Step 3: Post-deploy**

- Set `ELEVENLABS_API_KEY` environment variable in Vercel dashboard (Settings → Environment Variables)
- Test TTS on production after key is set

---

## Dependencies Between Tasks

```
Task 1 (mobile fix) — independent, can ship first
Task 2 (audio URL util) — independent
Task 3 (AudioPlayerProvider) — depends on Task 2 + Task 5
Task 4 (TTS proxy) — independent
Task 5 (ElevenLabs client) — depends on Task 4
Task 6 (AyahPlayButton) — depends on Task 3
Task 7 (ListenToLessonButton) — depends on Task 3
Task 8 (MiniPlayer) — depends on Task 3
Task 9 (integrate into JuzDigest) — depends on Task 6
Task 10 (integrate into RamadanDay) — depends on Tasks 7, 8, 9
Task 11 (verify & push) — depends on all above
```

Parallelizable groups:
- **Group A (independent):** Tasks 1, 2, 4
- **Group B (after A):** Tasks 3, 5
- **Group C (after B):** Tasks 6, 7, 8
- **Group D (after C):** Tasks 9, 10
- **Group E (after D):** Task 11
