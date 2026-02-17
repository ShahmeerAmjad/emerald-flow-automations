#!/bin/bash
# scripts/generate-juz.sh
# Usage: ./scripts/generate-juz.sh <juz_number> [end_juz_number]
# Examples:
#   ./scripts/generate-juz.sh 5       # Generate Juz 5 only
#   ./scripts/generate-juz.sh 13 30   # Generate Juz 13 through 30 (batch mode)
#
# Prerequisites:
#   - Claude Code CLI installed (npm i -g @anthropic-ai/claude-code)
#   - ANTHROPIC_API_KEY set in environment
#   - Git configured with push access to the repo

set -e

START_JUZ=$1
END_JUZ=${2:-$1}  # Default to single juz if no end specified

if [ -z "$START_JUZ" ]; then
  echo "Usage: ./scripts/generate-juz.sh <juz_number> [end_juz_number]"
  echo "   Single: ./scripts/generate-juz.sh 5"
  echo "   Batch:  ./scripts/generate-juz.sh 13 30"
  exit 1
fi

if [ "$START_JUZ" -lt 1 ] || [ "$START_JUZ" -gt 30 ] || [ "$END_JUZ" -lt 1 ] || [ "$END_JUZ" -gt 30 ]; then
  echo "Juz numbers must be between 1 and 30"
  exit 1
fi

if [ "$END_JUZ" -lt "$START_JUZ" ]; then
  echo "End juz ($END_JUZ) must be >= start juz ($START_JUZ)"
  exit 1
fi

# Navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

# Ensure data directory exists
mkdir -p src/data/ramadan

for JUZ_NUMBER in $(seq "$START_JUZ" "$END_JUZ"); do
  echo ""
  echo "Generating Ramadan digest for Juz $JUZ_NUMBER..."
  echo "---"

  # Invoke Claude Code with the generation task
  # Claude Code automatically reads CLAUDE.md from the repo root
  claude --model claude-opus-4-20250514 -p \
    "Generate the Ramadan daily digest for Juz $JUZ_NUMBER of 30 (Day $JUZ_NUMBER of Ramadan).

Follow the system prompt in prompts/ramadan-system-prompt.md exactly.
Output the content as valid JSON matching the JuzDigest type in src/types/ramadan.ts.
Write the file to src/data/ramadan/juz-${JUZ_NUMBER}.json.

IMPORTANT reminders:
- Hadith must be broadly accepted across Sunni AND Shia traditions. Include dual sourcing where possible.
- dailyPractice, habitCheckIn, discussionQuestions, and closingMessage must serve the MISSION of helping readers leave bad habits, become their best selves, and deeply understand the Quran.
- Avoid sectarian-contentious narrations.

After writing the file:
1. Verify the JSON is valid
2. Run npx tsc --noEmit to check types
3. Run npm run build to check the site compiles
4. Git add, commit with message 'content: add Juz ${JUZ_NUMBER} daily digest', and push to main"

  echo "Juz $JUZ_NUMBER complete!"
done

echo ""
echo "---"
echo "All done! Juz $START_JUZ-$END_JUZ generated and deployed."
echo "Site will update at sassolutions.ai/ramadan in ~30s"
