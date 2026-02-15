# ⚡ QUICK START — Copy-Paste Commands

## One-Time Setup (do this once)

```bash
# 1. Clone and enter your repo
git clone https://github.com/ShahmeerAmjad/emerald-flow-automations.git
cd emerald-flow-automations

# 2. Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# 3. Set your API key (add to ~/.bashrc or ~/.zshrc for persistence)
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# 4. Create directories
mkdir -p src/data/ramadan
mkdir -p src/components/ramadan
mkdir -p src/types
mkdir -p prompts
mkdir -p scripts

# 5. Copy all the files from this guide into the appropriate paths:
#    - src/types/ramadan.ts
#    - src/components/ramadan/JuzDigest.tsx
#    - src/pages/RamadanChallenge.tsx
#    - src/pages/Offer.tsx
#    - prompts/ramadan-system-prompt.md  (your attached document)
#    - scripts/generate-juz.sh
#    - CLAUDE.md
#    - .github/workflows/ramadan-daily.yml (optional)

# 6. Make the script executable
chmod +x scripts/generate-juz.sh

# 7. Add routes to your App.tsx (see ROUTE_SETUP_INSTRUCTIONS.tsx)

# 8. Test the build
npm install
npm run build

# 9. Push initial setup
git add -A
git commit -m "feat: add Ramadan Challenge and Offer pages"
git push origin main
```

## Daily Usage (every day of Ramadan)

```bash
# Generate and deploy today's content (replace N with juz number)
cd /path/to/emerald-flow-automations
./scripts/generate-juz.sh N

# That's it. Site auto-updates via Vercel in ~30 seconds.
```

## Verify It Worked

1. Check https://sassolutions.ai/ramadan — new day should appear
2. Check GitHub commits — should see "content: add Juz N daily digest"
3. Check Vercel dashboard — should show new deployment

## Alternative: Use Claude Code Directly (Interactive)

```bash
cd /path/to/emerald-flow-automations
claude

# Then inside Claude Code, type:
> Generate the Ramadan daily digest for Juz 5 of 30. Follow the system 
> prompt, write the JSON, build, commit, and push.
```

## Alternative: GitHub Actions (Fully Automated)

1. Add `ANTHROPIC_API_KEY` as a repo secret in GitHub Settings → Secrets
2. Update the Ramadan start date in `.github/workflows/ramadan-daily.yml`
3. Either let the cron trigger it daily, or manually trigger via GitHub Actions tab
