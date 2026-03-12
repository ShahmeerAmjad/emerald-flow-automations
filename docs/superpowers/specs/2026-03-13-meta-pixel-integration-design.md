# Meta Pixel + Conversions API Integration Design

**Date:** 2026-03-13
**Status:** Approved
**Scope:** Browser pixel + server-side CAPI for Meta (Facebook/Instagram) ads tracking

---

## Context

sassolutions.ai runs Meta ads driving traffic to `/offer` (AI Superpower Program) and `/landing` (Webinar). Currently no Meta Pixel is installed. Existing tracking includes GA4, Vercel Analytics, and a custom Google Sheets tracker.

## Architecture

```
User visits page
    |
    +-> Browser: Meta Pixel SDK (fbq) fires PageView, custom events
    |       |
    |       +-> Meta receives browser-side event (with fbp cookie, fbc click ID)
    |
    +-> React Hook: useMetaPixel()
            |
            +-> Fires fbq() calls for browser pixel
            +-> POST /api/meta-event (Vercel serverless)
                    |
                    +-> Meta Conversions API (server-side, deduplicated via event_id)
```

Every event gets a unique `event_id`. Both browser pixel and CAPI send the same `event_id` so Meta deduplicates automatically. If the pixel is blocked by ad blockers, CAPI still delivers the event.

## Events

| Event | Type | Pages | Trigger |
|-------|------|-------|---------|
| `PageView` | Standard | All pages | Page load |
| `ViewContent` | Standard | `/offer`, `/landing` | Page load (with content info) |
| `Lead` | Standard | `/offer` | Form submission |
| `ScrollDepth` | Custom | `/offer`, `/landing` | 25%, 50%, 75%, 100% scroll milestones |
| `TimeOnPage` | Custom | `/offer`, `/landing` | 30s, 60s, 120s thresholds |
| `CTAClick` | Custom | `/offer`, `/landing` | CTA button clicks |

Standard events (`PageView`, `ViewContent`, `Lead`) are used by Meta for ad optimization. Custom events (`ScrollDepth`, `TimeOnPage`, `CTAClick`) provide engagement data for retargeting audiences.

## File Changes

| File | Action | Purpose |
|------|--------|---------|
| `index.html` | Edit | Add Meta Pixel base code in `<head>` |
| `src/hooks/useMetaPixel.ts` | New | React hook for firing pixel + CAPI events |
| `src/lib/meta-pixel.ts` | New | Utilities: event ID generation, cookie reading, CAPI payload builder, SHA-256 hashing |
| `api/meta-event.ts` | New | Vercel serverless function for CAPI |
| `src/pages/Offer.tsx` | Edit | Wire up Lead, scroll, time, CTA events (additive only, no UI changes) |
| `src/pages/WebinarLanding.tsx` | Edit | Wire up ViewContent, scroll, time, CTA events |
| `src/App.tsx` | Edit | Add global PageView tracking on route changes |

## Meta Pixel Base Code (index.html)

Standard Meta snippet in `<head>` with placeholder `YOUR_PIXEL_ID_HERE`:

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

## useMetaPixel Hook

```typescript
// src/hooks/useMetaPixel.ts
// - trackEvent(eventName, params): fires fbq() + POSTs to CAPI
// - trackScrollDepth(milestone): fires at 25/50/75/100%
// - trackTimeOnPage(seconds): fires at 30s/60s/120s
// - trackCTAClick(buttonLabel): fires on CTA clicks
// - trackLead(formData): enriches CAPI with hashed email/phone for matching
// - All events include shared event_id for deduplication
// - Reads _fbp and _fbc cookies for user matching
```

## CAPI Serverless Function

```
POST /api/meta-event
Body: { event_name, event_id, event_time, user_data, custom_data, event_source_url }

- Reads META_PIXEL_ID and META_ACCESS_TOKEN from Vercel env vars
- Forwards to https://graph.facebook.com/v21.0/{pixel_id}/events
- Hashes user_data (email, phone, name) with SHA-256 before sending
- Adds client_ip_address and client_user_agent from request headers
- Returns { success: true } or error details
```

## User Data Matching (CAPI)

For the `Lead` event, the existing form collects name, email, and WhatsApp number:

| Field | Source | Processing |
|-------|--------|------------|
| `em` (email) | Form input | SHA-256, lowercased, trimmed |
| `ph` (phone) | WhatsApp number | SHA-256, digits only |
| `fn` (first name) | Full name (split) | SHA-256, lowercased |
| `ln` (last name) | Full name (split) | SHA-256, lowercased |
| `fbp` | `_fbp` cookie | Sent as-is |
| `fbc` | `_fbc` cookie or URL `fbclid` param | Sent as-is |
| `client_ip_address` | Request headers (serverless fn) | Sent as-is |
| `client_user_agent` | Request headers (serverless fn) | Sent as-is |

## Environment Variables (Vercel)

- `META_PIXEL_ID` — Pixel ID (to be provided)
- `META_ACCESS_TOKEN` — Generated in Meta Events Manager > Settings > Conversions API

## Constraints

- Offer.tsx and WebinarLanding.tsx edits are additive only (hook calls, no UI changes)
- index.html edit only adds the pixel snippet, no font or structural changes
- Pixel ID uses placeholder until provided
- Bot detection from existing usePageTracker should be respected (don't fire pixel for bots)
