#!/bin/bash
# scripts/generate-juz.sh
# Usage: ./scripts/generate-juz.sh <juz_number>
# Example: ./scripts/generate-juz.sh 5
#
# Prerequisites:
#   - Claude Code CLI installed (npm i -g @anthropic-ai/claude-code)
#   - ANTHROPIC_API_KEY set in environment
#   - Git configured with push access to the repo

set -e

JUZ_NUMBER=$1

if [ -z "$JUZ_NUMBER" ]; then
  echo "❌ Usage: ./scripts/generate-juz.sh <juz_number>"
  echo "   Example: ./scripts/generate-juz.sh 5"
  exit 1
fi

if [ "$JUZ_NUMBER" -lt 1 ] || [ "$JUZ_NUMBER" -gt 30 ]; then
  echo "❌ Juz number must be between 1 and 30"
  exit 1
fi

# Navigate to repo root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

echo "🌙 Generating Ramadan digest for Juz $JUZ_NUMBER..."
echo "──────────────────────────────────────────────"

# Ensure data directory exists
mkdir -p src/data/ramadan

# Invoke Claude Code with the generation task
# Claude Code automatically reads CLAUDE.md from the repo root
claude --model claude-opus-4-20250514 -p \
  "Generate the Ramadan daily digest for Juz $JUZ_NUMBER of 30 (Day $JUZ_NUMBER of Ramadan). 

Follow the system prompt in prompts/ramadan-system-prompt.md exactly.
Output the content as valid JSON matching the JuzDigest type in src/types/ramadan.ts.
Write the file to src/data/ramadan/juz-${JUZ_NUMBER}.json.

After writing the file:
1. Verify the JSON is valid
2. Run npm run build to check the site compiles
3. Git add, commit with message 'content: add Juz ${JUZ_NUMBER} daily digest', and push to main"

echo ""
echo "──────────────────────────────────────────────"
echo "✅ Juz $JUZ_NUMBER content generated and deployed!"
echo "🔗 Site will update at sassolutions.ai/ramadan in ~30s"
