// api/tts.ts — Vercel serverless function
// Proxies text-to-speech requests using free Microsoft Edge TTS

import type { VercelRequest, VercelResponse } from "@vercel/node";

const VOICE = "en-US-AndrewMultilingualNeural";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text is required" });
  }
  if (text.length > 5000) {
    return res.status(400).json({ error: "text too long (max 5000 chars)" });
  }

  // Clean text for natural speech
  const cleaned = text
    .replace(/\s*\(\d+:\d+(?:-\d+)?\)/g, "")
    .replace(/(\d+):(\d+)-(\d+)/g, (_: string, s: string, a: string, b: string) => `Surah ${s}, verses ${a} to ${b}`)
    .replace(/(\d+):(\d+)/g, (_: string, s: string, a: string) => `Surah ${s}, verse ${a}`)
    .replace(/ﷺ/g, ", peace be upon him,")
    .replace(/ﷻ/g, "")
    .replace(/\(AS\)/gi, ", peace be upon him,")
    .replace(/\(RA\)/gi, ", may Allah be pleased with them,")
    .replace(/\(SWT\)/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();

  try {
    const { Communicate } = await import("edge-tts-universal");
    const communicate = new Communicate(cleaned, { voice: VOICE });
    const chunks: Buffer[] = [];
    for await (const chunk of communicate.stream()) {
      if (chunk.type === "audio" && chunk.data) {
        chunks.push(chunk.data);
      }
    }
    const audioBuffer = Buffer.concat(chunks);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=604800");
    res.send(audioBuffer);
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "TTS generation failed" });
  }
}
