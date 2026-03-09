#!/usr/bin/env npx tsx
// scripts/generate-tts.ts
// Pre-generates TTS audio files for all Juz digests using Microsoft Edge TTS.
// Saves MP3s to public/audio/juz-{N}/{trackId}.mp3 and generates a manifest.
//
// Usage: npm run generate-tts [--from N] [--force]
// No API key required — uses free Edge TTS service.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

// ── Config ──────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, "..");
const DATA_DIR = join(ROOT, "src/data/ramadan");
const AUDIO_DIR = join(ROOT, "public/audio");
const MANIFEST_PATH = join(AUDIO_DIR, "manifest.json");

const VOICE = "en-US-AndrewMultilingualNeural"; // Warm, Confident, Authentic

// ── Types (minimal, matching JuzDigest) ─────────────────────────────

interface SurahBreakdown {
  name: string;
  revelationContext: string;
  coreTheme: string;
  keyTeachings: string[];
}

interface CoreTheme {
  name: string;
  explanation: string;
  dailyRelevance: string;
}

interface HadithOfTheDay {
  text: string;
  reflection: string;
  unableToVerify?: boolean;
}

interface DiscussionQuestions {
  reflectionQuestion: string;
  applicationQuestion: string;
}

interface StoryDeepDive {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  lessonsLearned: string[];
}

interface JuzDigest {
  juzNumber: number;
  juzSummary: string;
  surahBreakdowns: SurahBreakdown[];
  connectingTheDots: string;
  coreThemes: CoreTheme[];
  hadithOfTheDay: HadithOfTheDay;
  dailyPractice: string;
  discussionQuestions: DiscussionQuestions;
  habitCheckIn: string;
  closingMessage: string;
  stories?: StoryDeepDive[];
}

// ── Build TTS segments (mirrors ListenToLessonButton.buildPlaylist) ─

interface TtsSegment {
  id: string;
  text: string;
  label: string;
}

function buildSegments(digest: JuzDigest): TtsSegment[] {
  const segments: TtsSegment[] = [];

  // 1. Juz Summary
  segments.push({
    id: "tts-summary",
    text: digest.juzSummary,
    label: "Juz Summary",
  });

  // 2. Surah breakdowns
  digest.surahBreakdowns.forEach((surah, i) => {
    const ttsText = [
      surah.revelationContext,
      surah.coreTheme,
      surah.keyTeachings.join("\n"),
    ].join("\n\n");

    segments.push({
      id: `tts-surah-${i}`,
      text: ttsText,
      label: surah.name,
    });
  });

  // 3. Connecting the Dots
  segments.push({
    id: "tts-connecting",
    text: digest.connectingTheDots,
    label: "Connecting the Dots",
  });

  // 4. Core Themes (individual tracks for lesson playlist)
  digest.coreThemes.forEach((theme, i) => {
    segments.push({
      id: `tts-theme-${i}`,
      text: `${theme.name}. ${theme.explanation}\n\n${theme.dailyRelevance}`,
      label: theme.name,
    });
  });

  // 4b. Combined themes (for SectionReadButton which plays all themes at once)
  segments.push({
    id: "tts-themes",
    text: digest.coreThemes.map(t => `${t.name}. ${t.explanation} ${t.dailyRelevance}`).join("\n\n"),
    label: "Core Themes Combined",
  });

  // 5. Stories (Go Deeper)
  if (digest.stories) {
    digest.stories.forEach((story) => {
      const parts = [
        story.title,
        story.subtitle,
        ...story.paragraphs,
      ];
      if (story.lessonsLearned.length > 0) {
        parts.push("Lessons for Today:");
        parts.push(...story.lessonsLearned);
      }
      segments.push({
        id: `tts-section-section-story-${story.id}`,
        text: parts.filter(Boolean).join("\n\n"),
        label: story.title,
      });
    });
  }

  // 6. Hadith
  if (!digest.hadithOfTheDay.unableToVerify) {
    segments.push({
      id: "tts-hadith",
      text: `${digest.hadithOfTheDay.text}\n\n${digest.hadithOfTheDay.reflection}`,
      label: "Hadith of the Day",
    });
  }

  // 7. Daily Practice
  segments.push({
    id: "tts-practice",
    text: digest.dailyPractice,
    label: "Daily Practice",
  });

  // 8. Discussion Questions
  segments.push({
    id: "tts-discussion",
    text: `Reflection Question: ${digest.discussionQuestions.reflectionQuestion}\n\nApplication Question: ${digest.discussionQuestions.applicationQuestion}`,
    label: "Discussion Questions",
  });

  // 9. Habit Check-In & Closing
  segments.push({
    id: "tts-closing",
    text: `${digest.habitCheckIn}\n\n${digest.closingMessage}`,
    label: "Habit Check-In & Closing",
  });

  return segments;
}

// ── Text cleanup for natural speech ─────────────────────────────────

function cleanForSpeech(text: string): string {
  return text
    // Remove parenthetical verse references: (2:255), (15:28-35)
    .replace(/\s*\(\d+:\d+(?:-\d+)?\)/g, "")
    // Convert ranges: "15:28-35" → "Surah 15, verses 28 to 35"
    .replace(/(\d+):(\d+)-(\d+)/g, (_, s, a, b) => `Surah ${s}, verses ${a} to ${b}`)
    // Convert single refs: "2:255" → "Surah 2, verse 255"
    .replace(/(\d+):(\d+)/g, (_, s, a) => `Surah ${s}, verse ${a}`)
    // Islamic honorifics
    .replace(/ﷺ/g, ", peace be upon him,")
    .replace(/ﷻ/g, "")
    .replace(/\(AS\)/gi, ", peace be upon him,")
    .replace(/\(RA\)/gi, ", may Allah be pleased with them,")
    .replace(/\(SWT\)/gi, "")
    // Remove leftover empty parentheses
    .replace(/\(\s*\)/g, "")
    // Clean up double commas/spaces
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Edge TTS call ───────────────────────────────────────────────────

// Split text into chunks at sentence boundaries, each under maxLen chars
function splitText(text: string, maxLen = 800): string[] {
  if (text.length <= maxLen) return [text];
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current.length + sentence.length + 1 > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function generateTtsChunk(text: string, retries = 3): Promise<Buffer> {
  const { Communicate } = await import("edge-tts-universal");
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const communicate = new Communicate(text, { voice: VOICE });
      const chunks: Buffer[] = [];

      // Add a timeout to prevent hanging
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("TTS timeout after 30s")), 30000)
      );

      const stream = async () => {
        for await (const chunk of communicate.stream()) {
          if (chunk.type === "audio" && chunk.data) {
            chunks.push(chunk.data);
          }
        }
      };

      await Promise.race([stream(), timeout]);
      if (chunks.length === 0) throw new Error("No audio data received");
      return Buffer.concat(chunks);
    } catch (err) {
      if (attempt < retries) {
        console.log(`    Retry ${attempt}/${retries}...`);
        await new Promise(r => setTimeout(r, 1000 * attempt));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Unreachable");
}

async function generateTts(text: string): Promise<Buffer> {
  const cleaned = cleanForSpeech(text);
  const textChunks = splitText(cleaned);
  const audioChunks: Buffer[] = [];
  for (const chunk of textChunks) {
    const audio = await generateTtsChunk(chunk);
    audioChunks.push(audio);
  }
  return Buffer.concat(audioChunks);
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  // Parse flags
  const fromIdx = process.argv.indexOf("--from");
  const fromJuz = fromIdx !== -1 ? parseInt(process.argv[fromIdx + 1], 10) : 1;
  const toIdx = process.argv.indexOf("--to");
  const toJuz = toIdx !== -1 ? parseInt(process.argv[toIdx + 1], 10) : 30;
  const forceRegenerate = process.argv.includes("--force");

  // Find all juz files
  const juzFiles: number[] = [];
  for (let n = fromJuz; n <= toJuz; n++) {
    if (existsSync(join(DATA_DIR, `juz-${n}.json`))) {
      juzFiles.push(n);
    }
  }
  juzFiles.sort((a, b) => a - b);

  console.log(`Found ${juzFiles.length} Juz files: ${juzFiles.join(", ")}`);
  if (forceRegenerate) console.log("--force: regenerating all files");

  // Load existing manifest
  let manifest: Record<string, boolean> = {};
  if (existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  }

  let generated = 0;
  let skipped = 0;

  for (const juzNum of juzFiles) {
    const digest: JuzDigest = JSON.parse(
      readFileSync(join(DATA_DIR, `juz-${juzNum}.json`), "utf-8")
    );

    const segments = buildSegments(digest);
    const juzDir = join(AUDIO_DIR, `juz-${juzNum}`);

    console.log(`\nJuz ${juzNum} (${segments.length} segments):`);

    for (const segment of segments) {
      const key = `juz-${juzNum}/${segment.id}`;
      const filePath = join(juzDir, `${segment.id}.mp3`);

      // Skip if already exists (unless --force)
      if (!forceRegenerate && existsSync(filePath)) {
        skipped++;
        continue;
      }

      // Ensure directory exists
      mkdirSync(juzDir, { recursive: true });

      console.log(`  Generating: ${key} (${segment.label})...`);

      try {
        const audio = await generateTts(segment.text);
        writeFileSync(filePath, audio);
        manifest[key] = true;
        generated++;
      } catch (err) {
        console.error(`  ❌ Failed: ${key} — ${err}`);
      }
    }
  }

  // Merge with existing manifest (safe for parallel processes)
  mkdirSync(AUDIO_DIR, { recursive: true });
  let existing: Record<string, boolean> = {};
  if (existsSync(MANIFEST_PATH)) {
    try { existing = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")); } catch {}
  }
  const merged = { ...existing, ...manifest };
  writeFileSync(MANIFEST_PATH, JSON.stringify(merged, null, 2));

  console.log(`\n✅ Done! Generated: ${generated}, Skipped: ${skipped}`);
  console.log(`Manifest written to ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
