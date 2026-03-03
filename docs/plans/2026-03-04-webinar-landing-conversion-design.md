# Webinar Landing Page Conversion Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Increase webinar signup conversion from 3-4% to 8-12%+ by fixing message mismatch, adding urgency, and reducing friction.

**Architecture:** All changes are in a single file (`src/pages/WebinarLanding.tsx`). We add two helper functions (`getNextSunday`, `useCountdown`) inside the same file, rewrite the copy in 4 existing sections, and leave the confirmation view + form schema + Google Script integration untouched.

**Tech Stack:** React, TypeScript, Tailwind CSS, react-hook-form, zod, lucide-react

---

## Problem Summary

| Issue | Impact |
|-------|--------|
| Ad says "Pakistan's AI future" but page says "Learn to Build With AI" | Message mismatch — emotional momentum dies on arrival |
| "Every Sunday" = no urgency | No reason to register NOW |
| No specific date or countdown | Nothing time-bound |
| No above-fold CTA | Must scroll to reach form |
| Generic "What You'll Learn" bullets | Sounds like every AI page |

## Constraints

- Keep same form fields: `fullName`, `email`, `whatsapp`
- Keep same `GOOGLE_SCRIPT_URL` and `WHATSAPP_GROUP_URL`
- Keep same `formSchema` and `ConfirmationView`
- Match existing design system (dark theme `bg-[#050907]`, emerald accents, Sora + JetBrains Mono fonts)

---

## Task 1: Add `getNextSunday` helper and `useCountdown` hook

**Files:**
- Modify: `src/pages/WebinarLanding.tsx` (add after line 16, before the constants block)

**Step 1: Add the `getNextSunday` helper**

Add this function after the imports but before the constants. It computes the next Sunday 3:00 PM PKT (UTC+5) from the current time. If it's already past Sunday 3PM, it returns next week's Sunday.

```tsx
/* ═══ DATE HELPERS ═══ */

/** Returns the next Sunday at 3:00 PM PKT (UTC+5) as a Date object. */
function getNextSunday(): Date {
  const now = new Date();
  // PKT offset: UTC+5 = 300 minutes
  const PKT_OFFSET = 5 * 60;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const pktMinutes = utcMinutes + PKT_OFFSET;

  // Current day in PKT (0=Sun, 6=Sat)
  let pktDay = now.getUTCDay();
  if (pktMinutes >= 24 * 60) pktDay = (pktDay + 1) % 7;

  // Days until next Sunday
  let daysUntil = (7 - pktDay) % 7;

  // If it's Sunday in PKT, check if we're past 3 PM PKT
  if (daysUntil === 0) {
    const pktHour = (pktMinutes / 60) | 0;
    if (pktHour >= 15) daysUntil = 7; // past 3 PM, go to next week
  }

  // Build target date: next Sunday 3:00 PM PKT = 10:00 UTC
  const target = new Date(now);
  target.setUTCDate(target.getUTCDate() + daysUntil);
  // Adjust if PKT day rolled over
  if (pktMinutes >= 24 * 60) target.setUTCDate(target.getUTCDate() - 1 + daysUntil);
  target.setUTCHours(10, 0, 0, 0); // 3 PM PKT = 10:00 UTC
  // If target is in the past (edge case), add 7 days
  if (target.getTime() <= now.getTime()) target.setUTCDate(target.getUTCDate() + 7);
  return target;
}

/** Formats a Date as "March 9" style label. */
function formatSundayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Karachi",
  });
}
```

**Step 2: Add the `useCountdown` hook**

Add right below `getNextSunday`:

```tsx
import { useState, useEffect } from "react"; // update existing import

/* ═══ COUNTDOWN HOOK ═══ */

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function calcTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
```

**Step 3: Add `useMemo` to the existing React import**

Change line 1's import from:
```tsx
import { useState } from "react";
```
to:
```tsx
import { useState, useEffect, useMemo } from "react";
```

**Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS (helpers are defined but not yet used — no errors since they're in scope)

---

## Task 2: Rewrite the Hero section

**Files:**
- Modify: `src/pages/WebinarLanding.tsx` — the `RegistrationView` function, lines 148–174

**Step 1: Replace Hero section in `RegistrationView`**

Replace the entire `{/* Hero */}` section (lines 148–174) with:

```tsx
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-3 px-5 sm:px-7 py-2.5 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.07)] backdrop-blur-sm mb-7 sm:mb-9 animate-[fadeSlideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_both,borderGlow_4s_ease-in-out_infinite]">
          <span className="w-2 h-2 bg-[#47ECCC] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#2DB89B]" />
          <span className="font-['JetBrains_Mono',monospace] text-[11px] sm:text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium">
            Free Live Session&ensp;&middot;&ensp;This Sunday, {sundayLabel}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.98] tracking-[-2px] sm:tracking-[-3px] mb-2 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
          <span className="font-light text-[rgba(240,237,230,0.5)]">
            PAKISTAN WILL
          </span>{" "}
          <span className="bg-gradient-to-br from-[#2DB89B] via-[#47ECCC] to-[#2DB89B] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_6s_linear_infinite]">
            NOT BE LEFT BEHIND
          </span>
          <br />
          <span className="text-[rgba(240,237,230,0.9)]">IN AI</span>
        </h1>

        <p className="text-base sm:text-lg md:text-[22px] text-[rgba(240,237,230,0.5)] font-normal mt-5 sm:mt-6 leading-[1.65] max-w-[600px] mx-auto animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
          Join{" "}
          <strong className="text-[rgba(240,237,230,0.9)] font-semibold">
            200+ Pakistanis
          </strong>{" "}
          learning to build, automate, and earn with AI — live every Sunday. Your next session is in:
        </p>

        {/* Countdown Timer */}
        <CountdownDisplay timeLeft={timeLeft} />

        {/* Above-fold CTA */}
        <button
          type="button"
          onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-6 inline-flex items-center gap-2 bg-gradient-to-br from-[#2DB89B] to-[#47ECCC] text-[#050907] font-['Sora',sans-serif] text-base sm:text-lg font-extrabold uppercase tracking-[3px] sm:tracking-[5px] px-10 sm:px-14 py-4 sm:py-5 border-none cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(45,184,155,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(45,184,155,0.3)] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.55s_both]"
        >
          Reserve My Free Seat
        </button>
      </section>
```

**Step 2: Add `sundayLabel` and `timeLeft` to `RegistrationView`**

At the top of the `RegistrationView` function body (before the `return`), add:

```tsx
  const nextSunday = useMemo(() => getNextSunday(), []);
  const sundayLabel = useMemo(() => formatSundayLabel(nextSunday), [nextSunday]);
  const timeLeft = useCountdown(nextSunday);
```

**Step 3: Add the `CountdownDisplay` component**

Add this after the `Separator` component at the bottom of the file:

```tsx
function CountdownDisplay({ timeLeft }: { timeLeft: ReturnType<typeof calcTimeLeft> }) {
  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.45s_both]">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <span className="font-['JetBrains_Mono',monospace] text-3xl sm:text-4xl md:text-5xl font-bold text-[#47ECCC] tabular-nums leading-none">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-[10px] sm:text-xs tracking-[3px] uppercase text-[rgba(240,237,230,0.3)] mt-1">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl sm:text-3xl text-[rgba(45,184,155,0.3)] font-light -mt-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

---

## Task 3: Rewrite "What You'll Learn" bullets

**Files:**
- Modify: `src/pages/WebinarLanding.tsx` — `RegistrationView`, lines 179–199

**Step 1: Replace bullet content**

Replace the bullet array (lines 183–188) with outcome-driven copy:

```tsx
        {[
          { bold: "Build your first AI automation in 60 minutes", rest: " — not theory, a working thing" },
          { bold: "The exact AI freelancing playbook", rest: " earning Pakistanis Rs 50K-200K/month" },
          { bold: "Live demo: I'll build something from scratch", rest: " so you see how it's done" },
          { bold: "Q&A — bring YOUR use case", rest: " and we'll solve it together live" },
        ].map((item, i) => (
          <div
            key={i}
            className="text-[15px] sm:text-[17px] leading-[1.55] mb-3.5 pl-7 relative text-[rgba(240,237,230,0.7)]"
          >
            <span className="absolute left-0 top-0 font-bold text-base text-[#47ECCC]">
              ▸
            </span>
            <strong className="text-[rgba(240,237,230,0.9)] font-semibold">{item.bold}</strong>
            {item.rest}
          </div>
        ))}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

---

## Task 4: Rewrite Registration Form copy + add scroll target

**Files:**
- Modify: `src/pages/WebinarLanding.tsx` — `RegistrationView`, lines 203–287

**Step 1: Add `id="register"` to form section**

Change line 204:
```tsx
      <section className="p-6 sm:p-8 border ...">
```
to:
```tsx
      <section id="register" className="p-6 sm:p-8 border ...">
```

**Step 2: Update form header text**

Change "Reserve Your Spot" (line 208) to:
```tsx
          Save My Seat
```

**Step 3: Update form subtext with dynamic date**

Change line 210–211:
```tsx
        <p className="text-sm text-[rgba(240,237,230,0.4)] mb-6">
          Every Sunday at 3:00 PM PKT — completely free.
        </p>
```
to:
```tsx
        <p className="text-sm text-[rgba(240,237,230,0.4)] mb-6">
          This Sunday, {sundayLabel} at 3:00 PM PKT — completely free.
        </p>
```

**Step 4: Update submit button text**

Change line 283:
```tsx
              {isSubmitting ? "Registering..." : "Register Now — It's Free"}
```
to:
```tsx
              {isSubmitting ? "Saving your seat..." : "Save My Free Seat \u2192"}
```

**Step 5: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

---

## Task 5: Rewrite Urgency Box with countdown + secondary CTA

**Files:**
- Modify: `src/pages/WebinarLanding.tsx` — `RegistrationView`, lines 291–307

**Step 1: Replace entire urgency box section**

Replace lines 291–307 with:

```tsx
      {/* Urgency Box */}
      <section className="p-5 sm:p-6 border border-[rgba(45,184,155,0.1)] bg-[rgba(45,184,155,0.03)] text-center animate-[glowPulse_4s_ease-in-out_infinite]">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <span className="w-2.5 h-2.5 bg-[#47ECCC] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_12px_#2DB89B]" />
          <span className="font-['JetBrains_Mono',monospace] text-sm sm:text-[15px] text-[#47ECCC] tracking-[3px] uppercase font-bold">
            Next Session: This Sunday
          </span>
        </div>
        <p className="text-sm sm:text-base text-[rgba(240,237,230,0.5)] leading-[1.7] max-w-[520px] mx-auto mb-5">
          Last week's session had <strong className="text-[rgba(240,237,230,0.9)]">47 people</strong>. We cap it at{" "}
          <strong className="text-[rgba(240,237,230,0.9)]">100</strong> so everyone gets their questions answered.
        </p>

        {/* Repeated countdown */}
        <CountdownDisplay timeLeft={timeLeft} />

        {/* Secondary CTA */}
        <button
          type="button"
          onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-5 inline-flex items-center gap-2 bg-gradient-to-br from-[#2DB89B] to-[#47ECCC] text-[#050907] font-['Sora',sans-serif] text-sm sm:text-base font-extrabold uppercase tracking-[3px] px-8 sm:px-12 py-3 sm:py-4 border-none cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(45,184,155,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(45,184,155,0.3)]"
        >
          Save My Free Seat &rarr;
        </button>
      </section>
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

---

## Task 6: Final verification and commit

**Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: PASS with zero errors

**Step 2: Production build**

Run: `npm run build`
Expected: PASS — clean build output

**Step 3: Visual check with dev server**

Run: `npm run dev`
Open http://localhost:5173/landing and verify:
- Headline reads "PAKISTAN WILL NOT BE LEFT BEHIND IN AI"
- Countdown timer is ticking down to next Sunday 3PM PKT
- "Reserve My Free Seat" hero button scrolls to form
- Form says "Save My Seat" + "This Sunday, [date]"
- Urgency box shows countdown + secondary CTA
- After form submit, confirmation view is unchanged

**Step 4: Commit**

```bash
git add src/pages/WebinarLanding.tsx
git commit -m "feat: overhaul webinar landing for higher conversion

- Rewrite headline to match Pakistan AI-future ad angle
- Add live countdown timer to next Sunday 3PM PKT
- Add above-fold CTA button that scrolls to form
- Replace generic bullets with outcome-driven copy
- Update form copy and urgency box with specific numbers
- Keep same form schema and Google Sheets integration"
```

**Step 5: Push to main (triggers Vercel deploy)**

```bash
git push origin main
```
