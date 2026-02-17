# CLAUDE.md — Authoritative Project Instructions

> **This is the single source of truth.** Do NOT reference the parent directory CLAUDE.md for this project — this file supersedes it entirely.

## Project: sassolutions.ai — Ramadan Challenge + Offer Page

React + Vite + TypeScript + Tailwind CSS site deployed on Vercel (auto-deploys on push to main).

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npx tsc --noEmit  # Type check
```

## Architecture

```
src/
├── data/ramadan/juz-{1-30}.json   # Generated daily content (JSON)
├── pages/
│   ├── Offer.tsx                   # /offer — AI Superpower Program landing
│   └── RamadanChallenge.tsx        # /ramadan — Juz viewer with day selector
├── components/ramadan/
│   └── JuzDigest.tsx               # Renders a single Juz digest card
├── types/ramadan.ts                # TypeScript schema (JuzDigest interface)
prompts/ramadan-system-prompt.md    # Content generation system prompt
index.html                          # Entry point (fonts loaded here)
vercel.json                         # SPA rewrites
```

---

## CURRENT STATE — DO NOT REGRESS

The following files have been finalized. **Never overwrite, rewrite, or "improve" them unless explicitly asked:**

| File | Status | Notes |
|------|--------|-------|
| `src/pages/Offer.tsx` | **FINAL** | Matches `ai-program-path.html`. Uses Sora + JetBrains Mono fonts. Dark theme `bg-[#050907]`. |
| `src/pages/RamadanChallenge.tsx` | **FINAL** | Matches `ramadan-challenge.html`. Day selector, dynamic Juz loading. |
| `src/components/ramadan/JuzDigest.tsx` | **FINAL** | Rich renderer with Arabic text (Amiri font), amber accents, section cards. |
| `src/types/ramadan.ts` | **FINAL** | JuzDigest TypeScript schema. All generated JSON must match this exactly. Includes optional `ramadanIntro` field (Day 1 only). |
| `index.html` | **FINAL** | Loads Inter, Playfair Display, Amiri, Cormorant Garamond, Outfit, Sora, JetBrains Mono. |
| `vercel.json` | **FINAL** | SPA rewrites for /offer and /ramadan. |
| `ai-program-path.html` | Reference | HTML source-of-truth for Offer page design. |
| `ramadan-challenge.html` | Reference | HTML source-of-truth for Ramadan page design. |

### Content Progress

- **Juz 1–12**: Generated and committed.
- **Juz 13–30**: Remaining. Generate these when asked.

---

## Ramadan Content Generation

When asked to generate Juz digests:

### Step 1: Read these files first
1. `prompts/ramadan-system-prompt.md` — full generation instructions
2. `src/types/ramadan.ts` — the `JuzDigest` schema every JSON file must match
3. `src/data/ramadan/juz-1.json` — gold-standard reference for tone, depth, and format

### Step 2: Generate content
- Output ONLY valid JSON matching the `JuzDigest` type — no markdown, no code fences, no explanations
- Write to `src/data/ramadan/juz-{number}.json`

### Step 3: Verify and deploy
```bash
npx tsc --noEmit    # Must pass
npm run build       # Must pass
```
Then commit and push:
- Commit message: `content: add Juz {X} daily digest` (or `content: add Juz {X}-{Y} daily digests` for batches)
- Push to main (triggers Vercel deploy)

### Critical Content Rules

**Translations:**
- Use ONLY **Sahih International** or **The Clear Quran** (Dr. Mustafa Khattab)
- Always set `translationSource` to the exact name used

**Arabic text:**
- Must be accurate Quranic text — never fabricate or guess
- Verify verse numbers match the Arabic content

**Hadith:**
- Cite hadiths broadly accepted across Sunni AND Shia traditions
- Include dual sourcing where possible (e.g., "Sahih Muslim #2577; also in Al-Kafi, Vol. 2, Ch. 3")
- Avoid sectarian-contentious narrations
- Set `unableToVerify: true` if cross-traditional acceptance is uncertain
- Never fabricate hadith

**Mission (applies to every Juz):**
- `dailyPractice` — helps break a bad habit OR build a good one, tied to the Juz themes
- `habitCheckIn` — compassionate, specific accountability (not preachy)
- `discussionQuestions` — push toward real behavioral change
- `closingMessage` — reinforce personal transformation, not just reading completion

**Quality bar (match Juz 1):**
- `juzSummary`: 3-5 sentences, conversational but scholarly
- `surahBreakdowns`: meaningful `keyTeachings` (3-5 per surah), `standoutAyah` with genuine reflection
- `coreThemes`: 2-3 themes with practical `dailyRelevance`
- `keyAyat`: 3-5 verses with `reflectionPrompt` that provokes real thought
- `connectingTheDots`: show how the Surahs in this Juz relate thematically
- Keep content concise — designed for mobile/WhatsApp reading

---

## Anti-Regression Rules

1. **Never modify UI files** (Offer.tsx, RamadanChallenge.tsx, JuzDigest.tsx, index.html, vercel.json) unless the user explicitly asks for UI changes.
2. **Never change the TypeScript schema** (`src/types/ramadan.ts`) — all content must conform to the existing schema.
3. **Never overwrite existing Juz JSON files** — only create new ones for missing Juz numbers.
4. **Never remove font imports** from `index.html`.
5. **Never change vercel.json rewrites.**
6. **Always verify** with `npx tsc --noEmit` and `npm run build` before committing.
