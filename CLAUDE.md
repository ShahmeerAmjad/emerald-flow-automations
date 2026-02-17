# CLAUDE.md — Project Instructions for Claude Code

## Project: sassolutions.ai Ramadan Challenge

This is a React + Vite + TypeScript + Tailwind CSS site deployed on Vercel.

## Key Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Ramadan Content Generation Task

When asked to generate a Juz digest:

1. Read the system prompt at `prompts/ramadan-system-prompt.md`
2. Read the JSON schema types at `src/types/ramadan.ts`
3. Generate content for the requested Juz number following the system prompt EXACTLY
4. Output ONLY valid JSON matching the `JuzDigest` type — no markdown, no explanation
5. Write the JSON file to `src/data/ramadan/juz-{number}.json`

### Critical Rules:
- Use Sahih International or The Clear Quran translations ONLY
- Cite hadiths broadly accepted across Sunni AND Shia traditions; include dual sourcing where possible
- If unsure about cross-traditional acceptance, set `unableToVerify: true`
- Arabic text must be accurate — do not fabricate ayat
- Keep total content concise and readable (designed for WhatsApp/mobile)
- Each juz file must be valid JSON that passes TypeScript compilation
- `dailyPractice`, `habitCheckIn`, and `closingMessage` must serve the mission of helping readers leave bad habits and become their best selves

### After generating content:
- Run `npx tsc --noEmit` to verify no type errors
- Run `npm run build` to verify the site builds
- Stage, commit, and push changes with message: "content: add Juz {X} daily digest"
