// api/lead.ts — Vercel serverless function
//
// Single entry point for lead form submissions. Replaces direct browser
// POSTs to script.google.com (which get blocked by ad-blockers and ITP).
//
// Does two things in parallel:
//   1. Forwards to the correct Google Apps Script (offer vs webinar).
//   2. Fires Meta Conversions API server-side so we get a reliable Lead
//      event in Meta regardless of pixel blocking. Dedup with the browser
//      pixel via a shared event_id.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "node:crypto";

const OFFER_SCRIPT_URL =
  process.env.OFFER_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzeVb68IunL6BM6AOC5tleIh8mGkHkV4lXkoHJVzKYTL57CXhdmsvJDYrgTow3A9JKV3g/exec";

const WEBINAR_SCRIPT_URL =
  process.env.WEBINAR_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbxNRHAy5x2dZQD1tKFOsxhn7SBwQbSioDbhlamjcwE8_OdajRenwzZJ7SMSrria4n9G/exec";

const META_PIXEL_ID = process.env.META_PIXEL_ID || "1227366309555890";

type LeadType = "offer" | "webinar";

interface LeadPayload {
  leadType: LeadType;
  fullName: string;
  whatsapp: string;
  email?: string;
  goal?: string;
  sessionId?: string;
  visitorId?: string;
  eventId?: string;
  pageUrl?: string;
  fbp?: string;
  fbc?: string;
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

async function forwardToSheet(
  url: string,
  payload: LeadPayload
): Promise<{ ok: boolean; status?: string; error?: string }> {
  const body = JSON.stringify({
    eventType: "lead",
    fullName: payload.fullName,
    whatsapp: payload.whatsapp,
    email: payload.email || "",
    goal: payload.goal || "",
    sessionId: payload.sessionId || "",
    visitorId: payload.visitorId || "",
    eventId: payload.eventId || "",
    leadType: payload.leadType,
    timestamp: new Date().toISOString(),
  });
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
    });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return { ok: json.status === "ok", status: json.status, error: json.message };
    } catch {
      return { ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

async function fireMetaCAPI(
  payload: LeadPayload,
  req: VercelRequest
): Promise<{ sent: boolean; reason?: string }> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!accessToken) return { sent: false, reason: "META_ACCESS_TOKEN not configured" };

  const testEventCode = process.env.META_TEST_EVENT_CODE || undefined;
  const clientIp =
    ((req.headers["x-forwarded-for"] as string) || "").split(",")[0].trim() || "";
  const userAgent = (req.headers["user-agent"] as string) || "";

  const userData: Record<string, unknown> = {
    ph: [sha256(normalizePhone(payload.whatsapp))],
    fn: [sha256(payload.fullName)],
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  };
  if (payload.email) userData.em = [sha256(payload.email)];
  if (payload.fbp) userData.fbp = payload.fbp;
  if (payload.fbc) userData.fbc = payload.fbc;

  const eventData = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId || crypto.randomUUID(),
    event_source_url: payload.pageUrl || "",
    action_source: "website",
    user_data: userData,
    custom_data: {
      content_name:
        payload.leadType === "offer"
          ? "AI Advantage Program Application"
          : "Free AI Webinar Registration",
      content_category: payload.leadType,
      ...(payload.goal ? { goal: payload.goal } : {}),
    },
  };

  const url = `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events`;
  const body = {
    data: [eventData],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { sent: false, reason: `HTTP ${res.status}: ${text.substring(0, 200)}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: (err as Error).message };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let payload: LeadPayload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid JSON body" });
  }

  if (!payload || !payload.leadType || !payload.fullName || !payload.whatsapp) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields: leadType, fullName, whatsapp",
    });
  }

  const targetUrl =
    payload.leadType === "webinar" ? WEBINAR_SCRIPT_URL : OFFER_SCRIPT_URL;

  const [sheetResult, capiResult] = await Promise.all([
    forwardToSheet(targetUrl, payload),
    fireMetaCAPI(payload, req),
  ]);

  // We return 200 even if CAPI failed — the sheet write is the ground truth
  // signal for the user. CAPI details are included so issues surface in logs.
  return res.status(sheetResult.ok ? 200 : 502).json({
    ok: sheetResult.ok,
    sheet: sheetResult,
    capi: capiResult,
  });
}
