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
