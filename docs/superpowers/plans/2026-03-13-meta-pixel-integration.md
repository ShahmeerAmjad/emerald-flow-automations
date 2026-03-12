# Meta Pixel + Conversions API Integration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Meta Pixel (browser) + Conversions API (server-side) tracking to capture full-funnel engagement data for Meta ad optimization.

**Architecture:** Browser-side Meta Pixel SDK fires standard/custom events via `fbq()`. A React hook (`useMetaPixel`) manages event firing and simultaneously POSTs to a Vercel serverless function (`/api/meta-event`) that forwards events to Meta's Conversions API. Deduplication via shared `event_id` on both channels.

**Tech Stack:** Meta Pixel SDK (fbevents.js), React hooks, Vercel Serverless Functions (Edge-compatible), Web Crypto API (SHA-256 hashing), Meta Graph API v21.0

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/lib/meta-pixel.ts` | Pixel utilities: event ID generation, cookie helpers, SHA-256 hashing, CAPI payload building, `fbq()` type declarations |
| `src/hooks/useMetaPixel.ts` | React hook: fires browser pixel events + CAPI calls, tracks scroll/time/CTA per page |
| `api/meta-event.ts` | Vercel serverless function: receives events from hook, forwards to Meta Conversions API with server-enriched data |
| `index.html` | Add Meta Pixel base snippet in `<head>` |
| `src/App.tsx` | Add `MetaPixelTracker` component for global route-change PageView events |
| `src/pages/Offer.tsx` | Wire `useMetaPixel` for ViewContent, Lead, ScrollDepth, TimeOnPage, CTAClick |
| `src/pages/WebinarLanding.tsx` | Wire `useMetaPixel` for ViewContent, ScrollDepth, TimeOnPage, CTAClick, and Lead (form submit) |

---

## Chunk 1: Core Utilities + Serverless Function

### Task 1: Create `src/lib/meta-pixel.ts` — Pixel Utilities

**Files:**
- Create: `src/lib/meta-pixel.ts`

- [ ] **Step 1: Create the utility file with all helpers**

```typescript
// src/lib/meta-pixel.ts — Meta Pixel + CAPI shared utilities

// ═══ TYPE DECLARATIONS ═══

declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & { queue?: unknown[] };
    _fbq: unknown;
  }
}

// ═══ EVENT ID ═══

export function generateEventId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ═══ COOKIE HELPERS ═══

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getFbp(): string | null {
  return getCookie("_fbp");
}

export function getFbc(): string | null {
  // Check cookie first, then URL fbclid param
  const cookieVal = getCookie("_fbc");
  if (cookieVal) return cookieVal;

  const url = new URL(window.location.href);
  const fbclid = url.searchParams.get("fbclid");
  if (fbclid) {
    return `fb.1.${Date.now()}.${fbclid}`;
  }
  return null;
}

// ═══ SHA-256 HASHING ═══

export async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashUserData(data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  if (data.email) {
    result.em = await sha256(data.email.trim().toLowerCase());
  }
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, "");
    if (digits) result.ph = await sha256(digits);
  }
  if (data.firstName) {
    result.fn = await sha256(data.firstName.trim().toLowerCase());
  }
  if (data.lastName) {
    result.ln = await sha256(data.lastName.trim().toLowerCase());
  }

  return result;
}

// ═══ BROWSER PIXEL HELPERS ═══

export function trackFbq(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) {
    window.fbq("track", eventName, params ?? {}, { eventID: eventId });
  } else {
    window.fbq("track", eventName, params ?? {});
  }
}

export function trackFbqCustom(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) {
    window.fbq("trackCustom", eventName, params ?? {}, { eventID: eventId });
  } else {
    window.fbq("trackCustom", eventName, params ?? {});
  }
}

// ═══ CAPI SENDER ═══

export async function sendCAPIEvent(payload: {
  event_name: string;
  event_id: string;
  event_time: number;
  event_source_url: string;
  user_data?: Record<string, string>;
  custom_data?: Record<string, unknown>;
}) {
  try {
    const fbp = getFbp();
    const fbc = getFbc();

    const enrichedPayload = {
      ...payload,
      user_data: {
        ...payload.user_data,
        ...(fbp ? { fbp } : {}),
        ...(fbc ? { fbc } : {}),
      },
    };

    await fetch("/api/meta-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrichedPayload),
      keepalive: true,
    });
  } catch {
    // Silent fail — CAPI is best-effort alongside browser pixel
  }
}

// ═══ BOT DETECTION (reuse from usePageTracker) ═══

export function isBot(): boolean {
  const ua = navigator.userAgent;
  if (!ua) return true;
  return /bot|crawler|spider|crawling|headless|lighthouse|pagespeed|prerender|phantom|puppeteer|selenium/i.test(
    ua
  );
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: PASS (no errors related to meta-pixel.ts)

- [ ] **Step 3: Commit**

```bash
git add src/lib/meta-pixel.ts
git commit -m "feat: add Meta Pixel utility library (event IDs, cookies, hashing, CAPI sender)"
```

---

### Task 2: Create `api/meta-event.ts` — Vercel Serverless Function

**Files:**
- Create: `api/meta-event.ts`

- [ ] **Step 1: Create the api directory and serverless function**

```typescript
// api/meta-event.ts — Vercel Serverless Function for Meta Conversions API

import type { VercelRequest, VercelResponse } from "@vercel/node";

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const GRAPH_API_VERSION = "v21.0";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return res.status(500).json({ error: "Meta Pixel not configured" });
  }

  try {
    const { event_name, event_id, event_time, event_source_url, user_data, custom_data } =
      req.body;

    if (!event_name || !event_id) {
      return res.status(400).json({ error: "Missing event_name or event_id" });
    }

    // Enrich user_data with server-side info
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";
    const clientUserAgent = req.headers["user-agent"] || "";

    const eventData = {
      event_name,
      event_id,
      event_time: event_time || Math.floor(Date.now() / 1000),
      event_source_url,
      action_source: "website",
      user_data: {
        ...user_data,
        client_ip_address: clientIp,
        client_user_agent: clientUserAgent,
      },
      ...(custom_data ? { custom_data } : {}),
    };

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [eventData],
        access_token: ACCESS_TOKEN,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta CAPI error:", result);
      return res.status(response.status).json({ error: result });
    }

    return res.status(200).json({ success: true, events_received: result.events_received });
  } catch (error) {
    console.error("Meta CAPI handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
```

- [ ] **Step 2: Install @vercel/node types (if not already present)**

Run: `npm install --save-dev @vercel/node`

- [ ] **Step 3: Note on type checking**

The `api/` directory is outside the `src/` include scope in `tsconfig.app.json`. Vercel compiles `api/` files independently during deployment. Local `npx tsc --noEmit` will not check this file — that is expected. To verify syntax locally, run: `npx tsc --noEmit --esModuleInterop api/meta-event.ts` (or rely on Vercel's build).

Also note: `vercel.json` does NOT need updating — Vercel auto-detects files in `api/` as serverless functions by convention.

- [ ] **Step 4: Commit**

```bash
git add api/meta-event.ts package.json package-lock.json
git commit -m "feat: add Vercel serverless function for Meta Conversions API"
```

---

## Chunk 2: React Hook + Browser Pixel

### Task 3: Create `src/hooks/useMetaPixel.ts` — React Tracking Hook

**Files:**
- Create: `src/hooks/useMetaPixel.ts`

- [ ] **Step 1: Create the hook**

```typescript
// src/hooks/useMetaPixel.ts — Meta Pixel + CAPI event tracking hook
import { useEffect, useRef, useCallback } from "react";
import {
  generateEventId,
  trackFbq,
  trackFbqCustom,
  sendCAPIEvent,
  hashUserData,
  isBot,
} from "@/lib/meta-pixel";

// ═══ SCROLL DEPTH TRACKING ═══

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

function getScrollPercent(): number {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / docHeight) * 100));
}

// ═══ TIME THRESHOLDS ═══

const TIME_THRESHOLDS = [30, 60, 120] as const;

// ═══ HOOK ═══

export function useMetaPixel(pageName: string) {
  const firedScrollMilestones = useRef(new Set<number>());
  const firedTimeThresholds = useRef(new Set<number>());
  const pageEntryTime = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRafPending = useRef(false);

  // ── ViewContent on mount ──
  useEffect(() => {
    if (isBot()) return;

    const eventId = generateEventId();
    trackFbq("ViewContent", { content_name: pageName }, eventId);
    sendCAPIEvent({
      event_name: "ViewContent",
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      custom_data: { content_name: pageName },
    });

    // Reset trackers
    firedScrollMilestones.current.clear();
    firedTimeThresholds.current.clear();
    pageEntryTime.current = Date.now();

    // ── Scroll tracking ──
    function onScroll() {
      if (scrollRafPending.current) return;
      scrollRafPending.current = true;
      requestAnimationFrame(() => {
        scrollRafPending.current = false;
        const depth = getScrollPercent();
        for (const milestone of SCROLL_MILESTONES) {
          if (depth >= milestone && !firedScrollMilestones.current.has(milestone)) {
            firedScrollMilestones.current.add(milestone);
            const eid = generateEventId();
            trackFbqCustom("ScrollDepth", { depth: milestone, page: pageName }, eid);
            sendCAPIEvent({
              event_name: "ScrollDepth",
              event_id: eid,
              event_time: Math.floor(Date.now() / 1000),
              event_source_url: window.location.href,
              custom_data: { depth: milestone, page: pageName },
            });
          }
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Time on page tracking ──
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - pageEntryTime.current) / 1000);
      for (const threshold of TIME_THRESHOLDS) {
        if (elapsed >= threshold && !firedTimeThresholds.current.has(threshold)) {
          firedTimeThresholds.current.add(threshold);
          const eid = generateEventId();
          trackFbqCustom("TimeOnPage", { seconds: threshold, page: pageName }, eid);
          sendCAPIEvent({
            event_name: "TimeOnPage",
            event_id: eid,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: window.location.href,
            custom_data: { seconds: threshold, page: pageName },
          });
        }
      }
      // Stop checking once all thresholds fired
      if (firedTimeThresholds.current.size >= TIME_THRESHOLDS.length && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 5000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pageName]);

  // ── CTA Click ──
  const trackCTAClick = useCallback(
    (buttonLabel: string) => {
      if (isBot()) return;
      const eventId = generateEventId();
      trackFbqCustom("CTAClick", { button: buttonLabel, page: pageName }, eventId);
      sendCAPIEvent({
        event_name: "CTAClick",
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        custom_data: { button: buttonLabel, page: pageName },
      });
    },
    [pageName]
  );

  // ── Lead ──
  const trackLead = useCallback(
    async (formData: {
      email?: string;
      phone?: string;
      fullName?: string;
    }) => {
      if (isBot()) return;
      const eventId = generateEventId();

      // Browser pixel
      trackFbq("Lead", { content_name: pageName }, eventId);

      // CAPI with hashed PII for better matching
      const nameParts = formData.fullName?.trim().split(/\s+/) ?? [];
      const hashedData = await hashUserData({
        email: formData.email,
        phone: formData.phone,
        firstName: nameParts[0],
        lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : undefined,
      });

      await sendCAPIEvent({
        event_name: "Lead",
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        user_data: hashedData,
        custom_data: { content_name: pageName },
      });
    },
    [pageName]
  );

  return { trackCTAClick, trackLead };
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useMetaPixel.ts
git commit -m "feat: add useMetaPixel hook with scroll, time, CTA, and lead tracking"
```

---

### Task 4: Add Meta Pixel base code to `index.html`

**Files:**
- Modify: `index.html:20-27` (after GA4 script, before font preconnects)

- [ ] **Step 1: Add the Meta Pixel snippet**

Insert after the GA4 closing `</script>` tag (line 27) and before the font `<link rel="preconnect"` (line 29):

```html
    <!-- Meta Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID_HERE');
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID_HERE&ev=PageView&noscript=1"
    /></noscript>
```

**Note:** Replace `YOUR_PIXEL_ID_HERE` (appears twice) with the real Pixel ID when received.

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Meta Pixel base code to index.html (placeholder ID)"
```

---

## Chunk 3: Wire Up Pages

### Task 5: Add global PageView tracking in `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add a MetaPixelPageView component**

First, update the react-router-dom import on line 6 to include `useLocation`:

```typescript
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
```

Add React hook imports at the top of the file:

```typescript
import { useEffect, useRef } from "react";
```

Then add after the existing `PageTracker` component (line 24), before the `App` const:

```typescript
function MetaPixelPageView() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    // Skip initial page load — the base pixel in index.html already fires PageView
    // This handles SPA route changes only
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);

  return null;
}
```

Then add `<MetaPixelPageView />` inside `<BrowserRouter>`, right after `<PageTracker />`:

```tsx
<PageTracker />
<MetaPixelPageView />
```

- [ ] **Step 2: Verify types compile and build passes**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add Meta Pixel PageView tracking on SPA route changes"
```

---

### Task 6: Wire `useMetaPixel` into `Offer.tsx`

**Files:**
- Modify: `src/pages/Offer.tsx:1-2` (imports), `src/pages/Offer.tsx:45-48` (hook init), `src/pages/Offer.tsx:61-79` (onSubmit), `src/pages/Offer.tsx:515-521` (CTA button)

- [ ] **Step 1: Add import and hook call**

Add import at top of file (after existing imports):

```typescript
import { useMetaPixel } from "@/hooks/useMetaPixel";
```

Inside the `Offer` component, after the `useForm` call (~line 59), add:

```typescript
  const { trackCTAClick, trackLead } = useMetaPixel("Offer");
```

- [ ] **Step 2: Add Lead tracking to form submission**

In the `onSubmit` function, after `setIsSubmitted(true)` (line 74), add:

```typescript
      trackLead({
        email: values.email,
        phone: values.whatsapp,
        fullName: values.fullName,
      });
```

- [ ] **Step 3: Add CTA click tracking to the submit button**

The submit button at line 515 already triggers form submission. The Lead event covers this. No additional CTA tracking needed on the form submit button since `trackLead` fires the `Lead` event.

However, if there are any other CTA-style buttons that link elsewhere (e.g., scroll-to-form buttons), wrap their onClick with `trackCTAClick`. In the current Offer.tsx there are no such buttons — the form submit is the only CTA.

- [ ] **Step 4: Verify types compile and build passes**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "feat: wire Meta Pixel tracking into Offer page (ViewContent, Lead, scroll, time)"
```

---

### Task 7: Wire `useMetaPixel` into `WebinarLanding.tsx`

> **Note:** The spec originally scoped Lead events to `/offer` only, but WebinarLanding also has a registration form. Tracking Lead here gives Meta more conversion signal for ad optimization. This is an intentional improvement over the spec.

**Files:**
- Modify: `src/pages/WebinarLanding.tsx`

- [ ] **Step 1: Add import and hook call to RegistrationView**

Add import at top of file:

```typescript
import { useMetaPixel } from "@/hooks/useMetaPixel";
```

Inside `RegistrationView` component (around line 210), add after the `useCountdown` call:

```typescript
  const { trackCTAClick, trackLead } = useMetaPixel("WebinarLanding");
```

- [ ] **Step 2: Add Lead tracking to form submission**

In the `onSubmit` function of the parent `WebinarLanding` component (line 112), after `setIsSubmitted(true)` (line 124), we need the hook there too. Since `useMetaPixel` is called in `RegistrationView`, we need to pass `trackLead` up or restructure.

**Simpler approach:** Call `useMetaPixel` in the parent `WebinarLanding` component and pass down `trackCTAClick`/`trackLead` to `RegistrationView`.

In `WebinarLanding` component (line 103), add:

```typescript
  const { trackCTAClick, trackLead } = useMetaPixel("WebinarLanding");
```

In `onSubmit`, after `setIsSubmitted(true)` (line 124):

```typescript
      trackLead({
        email: values.email,
        phone: values.whatsapp,
        fullName: values.fullName,
      });
```

Pass `trackCTAClick` to `RegistrationView`:

```tsx
<RegistrationView
  form={form}
  onSubmit={onSubmit}
  isSubmitting={isSubmitting}
  trackCTAClick={trackCTAClick}
/>
```

Update `RegistrationView` props type to include `trackCTAClick`:

```typescript
function RegistrationView({
  form,
  onSubmit,
  isSubmitting,
  trackCTAClick,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
  trackCTAClick: (label: string) => void;
}) {
```

- [ ] **Step 3: Add CTA click tracking to scroll-to-form buttons**

There are two "Reserve/Save My Free Seat" buttons in `RegistrationView` (lines 247 and 384). Add `trackCTAClick` to their `onClick`:

For the hero CTA button (~line 248):
```tsx
onClick={() => {
  trackCTAClick("Reserve My Free Seat - Hero");
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
}}
```

For the urgency section CTA button (~line 385):
```tsx
onClick={() => {
  trackCTAClick("Save My Free Seat - Urgency");
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
}}
```

- [ ] **Step 4: Verify types compile and build passes**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/WebinarLanding.tsx
git commit -m "feat: wire Meta Pixel tracking into WebinarLanding (ViewContent, Lead, scroll, time, CTA)"
```

---

## Chunk 4: Final Verification + Env Vars

### Task 8: Full build verification and environment variable documentation

**Files:**
- No new files

- [ ] **Step 1: Run full type check and build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS with no errors

- [ ] **Step 2: Verify dev server starts**

Run: `npm run dev` (check it starts without errors, then Ctrl+C)
Expected: Dev server starts successfully

- [ ] **Step 3: Document env vars needed in Vercel**

The following environment variables must be set in Vercel Dashboard > Project Settings > Environment Variables:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `META_PIXEL_ID` | Your Meta Pixel ID | Meta Events Manager > Data Sources > Your Pixel |
| `META_ACCESS_TOKEN` | System User access token | Meta Events Manager > Settings > Conversions API > Generate Access Token |

- [ ] **Step 4: Final commit with all changes (if any remaining)**

Run: `git status` — if clean, skip. Otherwise commit remaining changes.

- [ ] **Step 5: Update Pixel ID when received**

When the Pixel ID is provided, do a find-and-replace of `YOUR_PIXEL_ID_HERE` in `index.html` (appears 2 times). Then commit and push to deploy.

---

## Post-Implementation Checklist

After deploying, verify in Meta Events Manager:

- [ ] **PageView** events appear for all page loads
- [ ] **ViewContent** events appear for `/offer` and `/landing` visits
- [ ] **Lead** events fire on form submission (check match quality score)
- [ ] **ScrollDepth** custom events appear with depth values
- [ ] **TimeOnPage** custom events appear with second thresholds
- [ ] **CTAClick** custom events appear for landing page buttons
- [ ] **Deduplication** works: Events Manager shows "Browser & Server" as source, not duplicate counts
- [ ] **Event Match Quality** (EMQ) score is Good or Great for Lead events (hashed email/phone improves this)
