# 🌙 Ramadan Challenge Automation System
## For sassolutions.ai — Powered by Claude Code + Vercel

---

## Overview

This guide sets up two new pages (`/offer` and `/ramadan`) on your existing site and creates an automated pipeline where:

1. You run **one command** daily via Claude Code
2. Claude Opus generates the Juz digest content using your system prompt
3. Content is saved as JSON, committed to GitHub, and auto-deployed to Vercel

---

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed (`npm install -g @anthropic-ai/claude-code`)
- GitHub repo cloned locally
- Vercel connected to your GitHub repo (not through Lovable)
- Node.js 18+

---

## PHASE 1: Project Setup

### 1.1 Disconnect Lovable

In your Vercel dashboard:
- Go to **Project Settings → Git**
- Ensure it's connected directly to `ShahmeerAmjad/emerald-flow-automations`
- Set **Production Branch** to `main`
- Set **Framework Preset** to `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### 1.2 Add These Files to Your Repo

Copy all files from this guide into your repo at the paths specified below.

---

## PHASE 2: File Structure

Add these to your existing repo:

```
src/
├── data/
│   └── ramadan/
│       └── .gitkeep              # Juz JSON files go here
├── pages/
│   ├── Offer.tsx                 # New /offer page
│   └── RamadanChallenge.tsx      # New /ramadan page
├── components/
│   └── ramadan/
│       ├── JuzDigest.tsx         # Main digest renderer
│       └── JuzSelector.tsx       # Day picker
├── types/
│   └── ramadan.ts                # TypeScript types for digest JSON
prompts/
│   └── ramadan-system-prompt.md  # Your system prompt (attached doc)
scripts/
│   └── generate-juz.sh           # The daily automation script
CLAUDE.md                          # Claude Code project instructions
```

---

## PHASE 3: Daily Automation — How It Works

### The One Command You Run Daily:

```bash
cd /path/to/emerald-flow-automations

# Generate today's Juz (replace 5 with the current day number)
./scripts/generate-juz.sh 5
```

### What Happens Behind the Scenes:

1. The script invokes Claude Code with your system prompt
2. Claude Opus generates Juz content as structured JSON
3. The JSON is saved to `src/data/ramadan/juz-5.json`
4. The script auto-commits and pushes to GitHub
5. Vercel detects the push and redeploys (takes ~30 seconds)
6. Your site at `sassolutions.ai/ramadan` now shows Day 5 content

### For Full Automation (Optional — No Manual Run):

Use a **cron job** or **GitHub Actions** to run daily at a set time.
See the GitHub Actions workflow file below.

---

## PHASE 4: Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Content format | JSON files | Simple, versionable, no database needed |
| Rendering | React component reads JSON | Fast, static, SEO-friendly |
| Deployment | Git push → Vercel | Zero config, instant deploys |
| Content generation | Claude Code CLI | Uses Opus model, reads system prompt from repo |
| Routing | React Router (already in your project) | Just add new routes |

---

## Troubleshooting

**Content not showing?** Check that `src/data/ramadan/juz-X.json` exists and matches the TypeScript type.

**Vercel not deploying?** Ensure the GitHub integration is active and the branch is `main`.

**Claude Code errors?** Make sure your `ANTHROPIC_API_KEY` is set and the `CLAUDE.md` file is in the repo root.
