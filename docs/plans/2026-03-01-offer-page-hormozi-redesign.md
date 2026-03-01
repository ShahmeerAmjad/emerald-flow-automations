# Offer Page Hormozi Grand Slam Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `src/pages/Offer.tsx` from "AI Superpower Program" to an Alex Hormozi Grand Slam Offer-style "AI Advantage Program" landing page — 8-week structure, value stack, guarantee, same visual DNA.

**Architecture:** Single-file rewrite. All changes are in `src/pages/Offer.tsx`. Keep imports, form logic, schema, Google Script URL, ambient orbs, keyframes, Separator, and footer unchanged. Replace the middle sections (hero copy, path cards, level sections) with new sections (hero, roadmap, value stack, guarantee, updated who-this-is-for, restructured CTA). Add new `PhaseCard` subcomponent, inline value stack and guarantee markup.

**Tech Stack:** React, TypeScript, Tailwind CSS, lucide-react (CheckCircle + Shield), shadcn/ui form components, zod.

---

### Task 1: Update Hero Section Copy

**Files:**
- Modify: `src/pages/Offer.tsx:94-121` (hero section)

**Step 1: Change the hero copy**

Replace the current hero section (lines 94-121) with:

```tsx
        {/* ═══ HERO ═══ */}
        <section className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 px-5 sm:px-7 py-2.5 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.07)] backdrop-blur-sm mb-7 sm:mb-9 animate-[fadeSlideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_both,borderGlow_4s_ease-in-out_infinite]">
            <span className="w-2 h-2 bg-[#47ECCC] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#2DB89B]" />
            <span className="font-['JetBrains_Mono',monospace] text-[11px] sm:text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium">
              Now Accepting Applications&ensp;·&ensp;Cohort 1
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[78px] font-extrabold leading-[0.98] tracking-[-2px] sm:tracking-[-3px] lg:tracking-[-4px] mb-2 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
            <span className="font-light text-[rgba(240,237,230,0.5)]">THE</span>{" "}
            <span className="bg-gradient-to-br from-[#2DB89B] via-[#47ECCC] to-[#2DB89B] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_6s_linear_infinite]">
              AI ADVANTAGE
            </span>
            <br />
            PROGRAM
          </h1>

          <div className="font-['JetBrains_Mono',monospace] text-sm sm:text-base tracking-[4px] uppercase text-[#47ECCC] mt-3 mb-5 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.22s_both]">
            Unlock Your Superpower
          </div>

          <p className="text-base sm:text-lg md:text-[22px] text-[rgba(240,237,230,0.5)] font-normal leading-[1.65] max-w-[800px] mx-auto animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
            In 8 weeks, go from <strong className="text-[rgba(240,237,230,0.9)] font-semibold">"I should learn AI"</strong> to building real AI products, landing clients, and leading Pakistan's AI future.
            <br className="hidden sm:block" />
            6 weeks of intensive learning. 2 weeks of <span className="text-[#47ECCC] font-semibold">building your own project</span>. One transformation.
          </p>

          <span className="inline-block mt-5 text-sm sm:text-base text-[rgba(240,237,230,0.28)] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.45s_both]">
            Applications closing soon. Limited spots in Cohort 1.
          </span>
        </section>
```

**Step 2: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 2: Replace Path Overview + Level Sections with 8-Week Roadmap

**Files:**
- Modify: `src/pages/Offer.tsx:138-228` (path overview + 3 level sections)
- Modify: `src/pages/Offer.tsx:539-567` (remove PathCard + PathArrow subcomponents)
- Modify: `src/pages/Offer.tsx:570-645` (remove LevelSection subcomponent)
- Add: new `PhaseCard` subcomponent at bottom of file

**Step 1: Add a `phaseColors` constant and `incubator` color (extend existing `levelColors` or add new)**

Add after the existing `levelColors` constant (keep `levelColors` for now, we'll clean up later):

```tsx
const phaseColors = {
  foundations: { accent: "#47ECCC", border: "rgba(71,236,204,0.2)", bg: "rgba(71,236,204,0.04)", barBg: "linear-gradient(90deg,#2DB89B,#47ECCC)" },
  builder: { accent: "#F0A830", border: "rgba(240,168,48,0.2)", bg: "rgba(240,168,48,0.04)", barBg: "linear-gradient(90deg,#F0A830,#FFD080)" },
  agentic: { accent: "#5B8DEF", border: "rgba(91,141,239,0.2)", bg: "rgba(91,141,239,0.04)", barBg: "linear-gradient(90deg,#5B8DEF,#90B8FF)" },
  incubator: { accent: "#47ECCC", border: "rgba(71,236,204,0.3)", bg: "rgba(71,236,204,0.06)", barBg: "linear-gradient(90deg,#2DB89B,#F0A830)" },
} as const;

type PhaseKey = keyof typeof phaseColors;
```

**Step 2: Add `PhaseCard` subcomponent**

Replace the old `PathCard`, `PathArrow`, and `LevelSection` subcomponents with:

```tsx
function PhaseCard({
  phase,
  weeks,
  name,
  bullets,
  tools,
  isIncubator,
}: {
  phase: PhaseKey;
  weeks: string;
  name: string;
  bullets: string[];
  tools: string[];
  isIncubator?: boolean;
}) {
  const c = phaseColors[phase];
  return (
    <div
      className={`p-6 sm:p-8 border bg-[#0C1210] relative transition-all duration-[400ms] hover:-translate-y-1 ${
        isIncubator
          ? "md:col-span-2 border-[rgba(71,236,204,0.2)]"
          : "border-[rgba(45,184,155,0.06)] hover:border-[rgba(45,184,155,0.12)]"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.barBg }} />
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-['JetBrains_Mono',monospace] text-[11px] font-bold tracking-[3px] uppercase px-3 py-1.5"
          style={{ color: c.accent, border: `1px solid ${c.border}`, background: c.bg }}
        >
          {weeks}
        </span>
        {isIncubator && (
          <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold tracking-[3px] uppercase px-3 py-1.5 bg-gradient-to-r from-[rgba(45,184,155,0.15)] to-[rgba(240,168,48,0.15)] border border-[rgba(71,236,204,0.2)] text-[#47ECCC]">
            BUILD
          </span>
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-extrabold tracking-[-0.5px] mb-4" style={{ color: isIncubator ? c.accent : undefined }}>
        {name}
      </h3>
      {bullets.map((item, i) => (
        <div key={i} className="text-[15px] leading-[1.55] mb-2.5 pl-6 relative text-[rgba(240,237,230,0.7)]">
          <span className="absolute left-0 top-0 font-bold text-sm" style={{ color: c.accent }}>
            {isIncubator ? "→" : "▸"}
          </span>
          {item}
        </div>
      ))}
      {tools.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[rgba(45,184,155,0.06)]">
          <div className="flex flex-wrap gap-1.5">
            {tools.map((tool, i) => (
              <span key={i} className="font-['JetBrains_Mono',monospace] text-[11px] px-3 py-1.5 bg-[#050907] border border-[rgba(45,184,155,0.06)] text-[rgba(240,237,230,0.5)] tracking-[0.5px]">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Replace the path overview + 3 LevelSections in the main JSX**

Remove everything between the mission banner `<Separator />` and the "Who Is This For" section (lines ~138-230), and replace with:

```tsx
        <Separator />

        {/* ═══ 8-WEEK ROADMAP ═══ */}
        <section>
          <div className="mb-6">
            <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-2">Your 8-Week Transformation</div>
            <div className="text-[17px] text-[rgba(240,237,230,0.28)]">Two months. Four phases. One completely transformed you.</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.2s_both]">
            <PhaseCard
              phase="foundations"
              weeks="Weeks 1-2"
              name="AI Foundations"
              bullets={[
                "Develop an AI-first mindset",
                "Master prompt engineering across ChatGPT, Claude & Gemini",
                "Generate professional images with AI",
                "Build & ship a website with Loveable",
              ]}
              tools={["ChatGPT", "Claude", "Gemini", "Image Gen", "Loveable"]}
            />
            <PhaseCard
              phase="builder"
              weeks="Weeks 3-4"
              name="Builder"
              bullets={[
                "Build automations with Make.com & n8n",
                "Create AI video & voice content",
                "Implement RAG & vector databases",
                "Data scraping with Apify & Firecrawl",
                "Learn Python, APIs, React basics",
              ]}
              tools={["Make.com", "n8n", "Video Gen", "Voice AI", "Apify", "Firecrawl", "Python", "React"]}
            />
            <PhaseCard
              phase="agentic"
              weeks="Weeks 5-6"
              name="Agentic"
              bullets={[
                "Build with Claude Code & Clawd bot",
                "Deploy on VPS with Docker",
                "Orchestrate multi-agent systems (LangChain, CrewAI)",
                "Master GitHub & version control",
                "Create AI skills & markdown systems",
              ]}
              tools={["Claude Code", "Clawd Bot", "VPS + Docker", "LangChain", "CrewAI", "GitHub"]}
            />
            <PhaseCard
              phase="incubator"
              weeks="Weeks 7-8"
              name="Incubator — Build Your Project"
              bullets={[
                "Apply everything you learned to build YOUR project",
                "1-on-1 mentor guidance throughout",
                "Weekly project reviews & feedback",
                "Launch-ready by Week 8",
                "Walk away with a portfolio piece that proves your skills",
              ]}
              tools={[]}
              isIncubator
            />
          </div>
        </section>

        <Separator />
```

**Step 4: Remove old subcomponents**

Delete these functions from the bottom of the file:
- `PathCard` (lines ~545-558)
- `PathArrow` (lines ~560-568)
- `LevelSection` (lines ~570-645)
- `levelColors` constant (lines ~539-543) — replaced by `phaseColors`

**Step 5: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

Run: `npm run build`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "feat: replace 3-level path with 8-week roadmap (Hormozi redesign)"
```

---

### Task 3: Add Value Stack Section

**Files:**
- Modify: `src/pages/Offer.tsx` (add new section between roadmap and who-this-is-for)
- Import: `Shield` from `lucide-react` (add to existing import)

**Step 1: Update lucide-react import**

Change:
```tsx
import { CheckCircle } from "lucide-react";
```
To:
```tsx
import { CheckCircle, Shield } from "lucide-react";
```

**Step 2: Add value stack data constant**

Add after `phaseColors` constant:

```tsx
const valueStack = [
  { name: "8-Week AI Advantage Program", desc: "6 weeks learning + 2 weeks hands-on incubator", value: "150,000" },
  { name: "Private Community + Weekly Mentorship Calls", desc: "Direct access to mentors & peer network", value: "50,000" },
  { name: "Prompt Library + Automation Templates + AI Toolkit", desc: "Battle-tested templates you can use immediately", value: "30,000" },
  { name: "Completion Certificate + Portfolio Project", desc: "LinkedIn-ready credentials & proof of work", value: "25,000" },
  { name: "Lifetime Access to Recordings + Future Updates", desc: "Alumni network & all future cohort materials", value: "40,000" },
] as const;
```

**Step 3: Add value stack section JSX**

Insert after the 8-week roadmap `<Separator />` and before the "Who This Is For" section:

```tsx
        {/* ═══ VALUE STACK ═══ */}
        <section className="p-6 sm:p-8 md:p-10 border border-[rgba(45,184,155,0.12)] bg-gradient-to-b from-[rgba(45,184,155,0.04)] to-transparent">
          <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-2">The Grand Slam Offer</div>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-extrabold tracking-[-1px] leading-[1.2] mb-8">
            Here's Everything You're Getting
          </h2>

          <div className="space-y-4">
            {valueStack.map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 sm:p-5 border-l-[3px] border-[#2DB89B] bg-[rgba(45,184,155,0.02)] hover:bg-[rgba(45,184,155,0.05)] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#47ECCC] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[17px] font-bold text-[rgba(240,237,230,0.9)]">{item.name}</div>
                    <div className="text-sm text-[rgba(240,237,230,0.4)]">{item.desc}</div>
                  </div>
                </div>
                <div className="sm:text-right pl-8 sm:pl-0">
                  <span className="font-['JetBrains_Mono',monospace] text-[15px] text-[rgba(240,96,80,0.5)] line-through">
                    Rs {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-8 pt-6 border-t border-[rgba(45,184,155,0.2)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="font-['JetBrains_Mono',monospace] text-xs tracking-[3px] uppercase text-[rgba(240,237,230,0.4)] mb-1">Total Value</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#47ECCC] tracking-[-1px]">
                  Rs 295,000
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold text-[rgba(240,237,230,0.9)] mb-1">
                  But you won't pay anywhere near that.
                </div>
                <div className="text-sm text-[rgba(240,237,230,0.4)]">
                  Apply now. Price discussed on your assessment call.
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />
```

**Step 4: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "feat: add Hormozi value stack with Rs 295,000 total value"
```

---

### Task 4: Add Guarantee Section

**Files:**
- Modify: `src/pages/Offer.tsx` (add section between value stack and who-this-is-for)

**Step 1: Add guarantee section JSX**

Insert after the value stack `<Separator />` and before "Who This Is For":

```tsx
        {/* ═══ GUARANTEE ═══ */}
        <section className="text-center p-8 sm:p-10 border border-[rgba(45,184,155,0.15)] bg-[rgba(45,184,155,0.03)] animate-[glowPulse_4s_ease-in-out_infinite] relative">
          <Shield className="w-12 h-12 text-[#47ECCC] mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-1px] mb-4">
            14-Day Money-Back Guarantee
          </h2>
          <p className="text-base sm:text-lg text-[rgba(240,237,230,0.6)] leading-[1.7] max-w-[640px] mx-auto mb-4">
            Join the first 2 weeks. Show up, do the work, complete the assignments. If you genuinely feel this program isn't for you, we'll refund every rupee.{" "}
            <strong className="text-[rgba(240,237,230,0.9)]">No questions. No hassle.</strong>{" "}
            We're that confident in what we've built.
          </p>
          <p className="text-sm text-[rgba(240,237,230,0.3)] font-['JetBrains_Mono',monospace] tracking-[1px]">
            You have nothing to lose and an entire AI career to gain.
          </p>
        </section>

        <Separator />
```

**Step 2: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "feat: add 14-day money-back guarantee section"
```

---

### Task 5: Update Who This Is For + CTA Copy

**Files:**
- Modify: `src/pages/Offer.tsx` (who-this-is-for bullets + CTA section copy)

**Step 1: Update "You belong here if" bullets**

Replace the array at approximately lines 239-245:

```tsx
              {[
                "You're tired of watching others use AI while you fall behind",
                "You want to offer AI services and command premium rates",
                "You're a student who wants skills that actually lead to income",
                "You're ready to commit 8 weeks and build something real",
                "You believe Pakistan deserves a seat at the AI table",
              ].map((line, i) => (
```

**Step 2: Update "Not for you if" bullets**

Replace the array at approximately lines 258-262:

```tsx
              {[
                "You want results without putting in the work",
                "You think AI is a passing trend you can ignore",
                "You won't implement what you learn",
                "You want motivation speeches — this is execution",
                "You're comfortable where you are and don't want change",
              ].map((line, i) => (
```

**Step 3: Update CTA section heading and subtext**

Replace the CTA heading (line ~278-281):

```tsx
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-1px] sm:tracking-[-1.5px] leading-[1.2] mb-4 relative z-10">
              Your Transformation Starts<br />
              With <span className="text-[#47ECCC]">One Application.</span>
            </h2>
```

Replace the CTA subtext (line ~283-285):

```tsx
          <p className="text-base sm:text-lg md:text-[19px] text-[rgba(240,237,230,0.5)] leading-[1.65] max-w-[680px] mx-auto mb-3 relative z-10">
            We're not selling a course. We're building a movement. Apply now and a member of our team will contact you within <strong className="text-[rgba(240,237,230,0.9)]">48 hours</strong>.
          </p>
```

**Step 4: Update submit button text**

Change line ~451 from:

```tsx
                    {isSubmitting ? "Submitting..." : "Submit Application"}
```

To:

```tsx
                    {isSubmitting ? "Submitting..." : "Apply Now — Limited Spots"}
```

**Step 5: Update FOMO box copy to say "Cohort 1"**

Change "Limited seats in the first cohort" (line ~463) to:

```tsx
                Limited seats in Cohort 1
```

**Step 6: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Both pass with no errors

**Step 7: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "feat: update copy for who-this-is-for, CTA, and FOMO sections"
```

---

### Task 6: Clean Up Old Components + Final Verification

**Files:**
- Modify: `src/pages/Offer.tsx` (remove dead code)

**Step 1: Remove `levelColors` constant**

Delete lines ~539-543:
```tsx
const levelColors = {
  l1: { ... },
  l2: { ... },
  l3: { ... },
} as const;
```

**Step 2: Remove `PathCard` function**

Delete the entire `PathCard` function (~lines 545-558).

**Step 3: Remove `PathArrow` function**

Delete the entire `PathArrow` function (~lines 560-568).

**Step 4: Remove `LevelSection` function**

Delete the entire `LevelSection` function (~lines 570-645).

**Step 5: Update file comment**

Change line 1 from:
```tsx
// src/pages/Offer.tsx — AI Superpower Program Landing Page
```
To:
```tsx
// src/pages/Offer.tsx — AI Advantage Program Landing Page (Hormozi Grand Slam Offer)
```

**Step 6: Full verification**

Run: `npx tsc --noEmit`
Expected: No errors

Run: `npm run build`
Expected: Build succeeds with no warnings about unused code

Run: `npm run dev` (manual check)
Expected: Page loads at /offer, shows new hero, 8-week roadmap (2x2 grid), value stack, guarantee, updated copy

**Step 7: Final commit**

```bash
git add src/pages/Offer.tsx
git commit -m "refactor: remove old PathCard, PathArrow, LevelSection components"
```

---

## Summary

| Task | What | Est. Lines Changed |
|------|------|--------------------|
| 1 | Hero copy → AI Advantage Program + "Unlock Your Superpower" | ~30 lines |
| 2 | Replace 3-level path with 8-week 2x2 roadmap + PhaseCard | ~200 lines (remove ~180, add ~130) |
| 3 | Add value stack section with 5 items totaling Rs 295K | ~60 lines added |
| 4 | Add guarantee section with 14-day money-back | ~20 lines added |
| 5 | Update who-this-is-for bullets + CTA copy + button text | ~20 lines changed |
| 6 | Clean up dead components + final verification | ~110 lines removed |

**Total: ~540 lines of changes in one file, 6 commits.**
