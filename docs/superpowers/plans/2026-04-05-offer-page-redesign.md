# Offer Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Offer.tsx to reposition around consulting mindset, simplify lead capture to 3 fields, add schedule banner and problem section, and update all copy.

**Architecture:** Single-file edit to `src/pages/Offer.tsx`. No new files or components. The page already uses inline sub-components (`PhaseCard`, `Separator`) and data arrays (`valueStack`, `phaseColors`). We follow the same pattern — add a `ScheduleBanner` and `ProblemSection` inline component, update data arrays, and rewrite JSX copy.

**Tech Stack:** React, TypeScript, Tailwind CSS, Zod, react-hook-form, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-04-05-offer-page-redesign.md`

---

## File Map

- **Modify:** `src/pages/Offer.tsx` (all changes in this single file)
  - Zod schema (lines 29-41) — simplify to 3 fields
  - Form default values (lines 49-58) — match new schema
  - `onSubmit` payload (lines 62-79) — send new fields
  - Hero section (lines 94-125) — new copy
  - Mission banner (lines 127-140) — move after Problem, new copy
  - Roadmap PhaseCard data (lines 152-223) — new bullets/outcomes
  - Value stack data array (lines 608-614) — update first item desc
  - Who This Is For (lines 301-338) — new bullets
  - CTA / Form section (lines 342-549) — new heading, simplified form, new confirmation
  - New sections: Schedule Banner, Problem Section — add as inline components

---

### Task 1: Update Zod Schema & Form Logic

**Files:**
- Modify: `src/pages/Offer.tsx:29-58` (schema + form defaults)
- Modify: `src/pages/Offer.tsx:62-79` (onSubmit payload)

- [ ] **Step 1: Replace the Zod schema**

Replace lines 29-41:

```tsx
const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
  goal: z.enum([
    "Land freelance/consulting clients",
    "Earn income in dollars",
    "Automate my business with AI",
    "Get a better job / advance my career",
    "Learn AI skills to future-proof myself",
  ], {
    required_error: "Please select what you want to achieve",
  }),
});
```

- [ ] **Step 2: Update form default values**

Replace the `defaultValues` object inside `useForm`:

```tsx
defaultValues: {
  fullName: "",
  whatsapp: "",
  goal: undefined,
},
```

- [ ] **Step 3: Update onSubmit payload**

The `body: JSON.stringify(...)` inside `onSubmit` should send:

```tsx
body: JSON.stringify({
  eventType: "lead",
  ...values,
  timestamp: new Date().toISOString(),
}),
```

No change needed here — the spread already sends whatever the schema contains. Just verify it works with the new fields.

- [ ] **Step 4: Remove unused imports**

Remove these imports that are no longer used by the simplified form:
- `Textarea` from `@/components/ui/textarea`

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "refactor: simplify offer form schema to 3 fields (name, whatsapp, goal)"
```

---

### Task 2: Rewrite Hero Section

**Files:**
- Modify: `src/pages/Offer.tsx` — Hero section (lines 94-125)

- [ ] **Step 1: Replace the hero badge text**

Replace:
```tsx
Founding Member Pricing&ensp;·&ensp;Cohort 1
```

With:
```tsx
Starts April 20&ensp;·&ensp;Cohort 1&ensp;·&ensp;Limited Seats
```

- [ ] **Step 2: Replace the hero tagline**

Replace the `div` with "Unlock Your Superpower":
```tsx
<div className="font-['JetBrains_Mono',monospace] text-sm sm:text-base tracking-[4px] uppercase text-[#47ECCC] mt-3 mb-5 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.22s_both]">
  Become The Person Businesses Call
</div>
```

- [ ] **Step 3: Replace the hero description paragraph**

Replace the `<p>` after the tagline:
```tsx
<p className="text-base sm:text-lg md:text-[22px] text-[rgba(240,237,230,0.5)] font-normal leading-[1.65] max-w-[800px] mx-auto animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
  In 8 weeks, go from <strong className="text-[rgba(240,237,230,0.9)] font-semibold">"I should learn AI"</strong> to landing real clients, solving real business problems, and earning dollars — with a consulting mindset that makes you indispensable in 2026 and beyond.
  <br className="hidden sm:block" />
  6 weeks of intensive learning. 2 weeks of <span className="text-[#47ECCC] font-semibold">building your own AI consulting project</span>. One career-defining transformation.
</p>
```

- [ ] **Step 4: Replace the closing span**

Replace "Applications closing soon. Limited spots in Cohort 1." with:
```tsx
<span className="inline-block mt-5 text-sm sm:text-base text-[rgba(240,237,230,0.28)] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.45s_both]">
  Limited spots in Cohort 1. Your seat won't wait.
</span>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "content: rewrite hero for consulting positioning and April 20 start"
```

---

### Task 3: Add Schedule Banner & Problem Section

**Files:**
- Modify: `src/pages/Offer.tsx` — add two new sections after hero, before mission banner

- [ ] **Step 1: Add ScheduleBanner component at bottom of file**

Add before the closing of the file, after the `PhaseCard` component:

```tsx
function ScheduleBanner() {
  return (
    <section className="p-6 sm:p-8 md:p-10 bg-[#0C1210] border border-[rgba(45,184,155,0.12)] relative overflow-hidden animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2DB89B] via-[#47ECCC] to-[#2DB89B]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
        {[
          { label: "Start Date", value: "April 20, 2026" },
          { label: "Weekdays", value: "Tue & Thu, 7:00\u2013\u20098:30 PM" },
          { label: "Weekend", value: "Sat or Sun, Afternoon" },
          { label: "Format", value: "100% Online \u00B7 Live" },
        ].map((item, i) => (
          <div key={i}>
            <div className="font-['JetBrains_Mono',monospace] text-[11px] tracking-[3px] uppercase text-[#2DB89B] font-medium mb-1.5">
              {item.label}
            </div>
            <div className="text-lg sm:text-xl font-bold text-[rgba(240,237,230,0.9)] leading-[1.3]">
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-base sm:text-lg text-[rgba(240,237,230,0.5)] leading-[1.7]">
        3 live sessions/week. You don't learn AI alone — you build alongside a{" "}
        <strong className="text-[rgba(240,237,230,0.9)] font-semibold">community of driven builders</strong> who push each other forward.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Add ProblemSection component at bottom of file**

```tsx
function ProblemSection() {
  return (
    <section className="p-6 sm:p-8 md:p-10 border border-[rgba(240,96,80,0.08)] bg-[rgba(240,96,80,0.02)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E8705F] to-transparent" />
      <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#E8705F] font-medium mb-2">
        The Problem
      </div>
      <h2 className="text-2xl sm:text-[30px] font-extrabold leading-[1.25] tracking-[-1px] mb-6">
        Everyone's "Learning AI."{" "}
        <span className="text-[rgba(240,237,230,0.5)]">Nobody's</span>{" "}
        <span className="text-[#E8705F]">Earning</span> From It.
      </h2>
      {[
        "You've watched 100 YouTube tutorials and still can't land a single client",
        "You know how to prompt ChatGPT but have no idea how to turn that into income",
        "Every course teaches you tools \u2014 none teach you how to solve real business problems",
        "You're \u201Clearning AI\u201D but your career path looks exactly the same as it did last year",
        "The world is hiring AI consultants and you're stuck wondering where to even start",
      ].map((line, i) => (
        <div key={i} className="text-[17px] leading-[1.6] mb-3 pl-7 relative text-[rgba(240,237,230,0.7)]">
          <span className="absolute left-0 top-0.5 text-[#E8705F] font-bold">✕</span>
          {line}
        </div>
      ))}
      <p className="mt-5 text-base sm:text-lg text-[rgba(240,237,230,0.5)] leading-[1.7] border-t border-[rgba(240,96,80,0.1)] pt-5">
        This program doesn't teach you AI tools and wish you luck. It turns you into{" "}
        <strong className="text-[rgba(240,237,230,0.9)] font-semibold">the person businesses pay to solve their problems.</strong>
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Insert new sections into the page layout**

In the JSX return, after the `</section>` closing the hero and before the mission banner, insert:

```tsx
<ScheduleBanner />

<Separator />

<ProblemSection />

<Separator />
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "feat: add schedule banner and problem agitation section"
```

---

### Task 4: Update Mission Banner Copy & Position

**Files:**
- Modify: `src/pages/Offer.tsx` — Mission Banner section

The mission banner currently sits right after the hero. After Task 3, the schedule banner and problem section are between them. The mission banner should now come **after** the problem section (which it naturally does since we inserted the new sections before it).

- [ ] **Step 1: Update mission banner body text**

Replace the `<p>` inside the mission banner section:

```tsx
<p className="text-base sm:text-lg text-[rgba(240,237,230,0.5)] leading-[1.7] max-w-[820px]">
  The rest of the world is hiring AI consultants at $50–150/hour. Pakistani talent has the skills, the hunger, and the hustle — but not the right training.{" "}
  <strong className="text-[rgba(240,237,230,0.9)] font-semibold">We're not teaching you to pass a quiz.</strong>{" "}
  We're building a community of AI consultants who land global clients, solve real business problems, and prove that Pakistan competes with anyone on the planet.
</p>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "content: update mission banner for consulting positioning"
```

---

### Task 5: Update Roadmap Phase Card Content

**Files:**
- Modify: `src/pages/Offer.tsx` — PhaseCard props in the roadmap section (lines 152-223)

- [ ] **Step 1: Update Phase 1 (Foundations) props**

Replace the Foundations PhaseCard:

```tsx
<PhaseCard
  phase="foundations"
  weeks="Weeks 1-2"
  name="AI Foundations"
  bullets={[
    "Develop an AI-first consulting mindset for work & business",
    "Master prompts that deliver client-ready output, not just \"cool\" responses",
    "Build a website for your AI consulting practice",
    "Create professional visuals and branding with AI",
  ]}
  outcomes={[
    "Confidence to walk into any business and show them what AI can do",
    "A live website you built and launched yourself",
    "Prompt skills that 95% of professionals don't have",
  ]}
  tools={["ChatGPT", "Claude", "Gemini", "Midjourney", "Loveable"]}
/>
```

- [ ] **Step 2: Update Phase 2 (Builder) props**

```tsx
<PhaseCard
  phase="builder"
  weeks="Weeks 3-4"
  name="Builder"
  bullets={[
    "Build automations you can package and sell to local businesses",
    "Content systems that replace entire marketing teams",
    "Data scraping and lead generation for clients",
    "Learn Python basics, APIs & connect everything into real solutions",
    "Turn one piece of content into 10 with AI repurposing",
  ]}
  outcomes={[
    "3\u20135 packaged AI services you can pitch to businesses this week",
    "A content creation workflow that replaces a whole team",
    "Technical skills that set you apart from every other freelancer",
  ]}
  tools={["Make.com", "n8n", "HeyGen", "ElevenLabs", "CapCut", "Apify", "Python"]}
/>
```

- [ ] **Step 3: Update Phase 3 (Agentic) props**

```tsx
<PhaseCard
  phase="agentic"
  weeks="Weeks 5-6"
  name="Agentic"
  bullets={[
    "Build AI-powered apps with Claude Code",
    "Deploy AI agents that run 24/7 for clients",
    "Custom chatbots and assistants businesses will pay for",
    "Master GitHub & version control like a real developer",
    "Deploy Skills & MCPs within Claude Code to build multiple AI agents",
  ]}
  outcomes={[
    "You can now build what most agencies charge $5,000\u2013$10,000 for",
    "Your own AI agents running 24/7 on autopilot",
    "A GitHub portfolio that proves you're the real deal",
  ]}
  tools={["Claude Code", "Skills", "MCPs", "Docker", "GitHub", "Vercel"]}
/>
```

- [ ] **Step 4: Update Phase 4 (Incubator) props**

```tsx
<PhaseCard
  phase="incubator"
  weeks="Weeks 7-8"
  name="Incubator — Build Your Project"
  bullets={[
    "Apply everything you learned to build YOUR project",
    "1-on-1 mentor guidance throughout",
    "Weekly project reviews & feedback",
    "Launch something real \u2014 a product, a client project, or your consulting practice",
  ]}
  outcomes={[
    "A finished AI product you built and launched",
    "Real portfolio proof to show clients or employers",
    "The confidence to build anything with AI",
  ]}
  tools={[]}
  isIncubator
/>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "content: update roadmap phases for consulting/client-value framing"
```

---

### Task 6: Update Value Stack Data

**Files:**
- Modify: `src/pages/Offer.tsx` — `valueStack` array (line 608-614)

- [ ] **Step 1: Update first item description**

Replace in the `valueStack` array:

```tsx
{ name: "8-Week AI Advantage Program", desc: "3 live classes/week + community building sessions", value: "150,000" },
```

Only the `desc` field changes. All other items stay the same.

- [ ] **Step 2: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "content: update value stack description for 3 classes/week"
```

---

### Task 7: Update "Who This Is For" Copy

**Files:**
- Modify: `src/pages/Offer.tsx` — Who This Is For section (lines 301-338)

- [ ] **Step 1: Replace "You belong here if" bullets**

```tsx
{[
  "You're tired of learning AI in isolation and want to build alongside a driven community",
  "You're a freelancer who wants to offer AI consulting services and charge in dollars",
  "You're a student who wants real skills that lead to real clients, not just a certificate",
  "You're a business owner who wants to automate operations and solve problems with AI",
  "You're ready to invest 8 weeks to become the person businesses call for AI solutions",
].map((line, i) => (
```

- [ ] **Step 2: Replace "Not for you if" bullets**

```tsx
{[
  "You want a certificate to hang on the wall \u2014 this is about landing clients and earning",
  "You can't commit to 3 live sessions per week and the assignments",
  "You think learning AI means memorizing prompts \u2014 we build real solutions here",
  "You want someone to hand you clients \u2014 we teach you how to win them yourself",
  "You're looking for passive income with zero effort \u2014 consulting takes real work",
].map((line, i) => (
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "content: update 'who this is for' with consulting/community focus"
```

---

### Task 8: Simplify Lead Capture Form & CTA

**Files:**
- Modify: `src/pages/Offer.tsx` — CTA section (lines 342-549)

- [ ] **Step 1: Update CTA heading**

Replace:
```tsx
Your Transformation Starts<br />
With <span className="text-[#47ECCC]">One Application.</span>
```

With:
```tsx
Your Transformation Starts<br />
With <span className="text-[#47ECCC]">One Call.</span>
```

- [ ] **Step 2: Update CTA sub-line**

Replace:
```tsx
We're not selling a course. We're building a movement. Apply now and a member of our team will contact you within <strong className="text-[rgba(240,237,230,0.9)]">48 hours</strong>.
```

With:
```tsx
Reserve your spot and a member of our team will call you within <strong className="text-[rgba(240,237,230,0.9)]">48 hours</strong> to walk you through the program.
```

- [ ] **Step 3: Update form label**

Replace:
```tsx
NOW ACCEPTING APPLICATIONS
```

With:
```tsx
RESERVE YOUR SPOT
```

- [ ] **Step 4: Replace entire form fields block**

Replace everything inside the `<form>` tag (from the first grid div through the submit button) with:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
  <FormField
    control={form.control}
    name="fullName"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">Full Name</FormLabel>
        <FormControl>
          <Input
            placeholder="Your full name"
            className="bg-[#0C1210] border-[rgba(45,184,155,0.12)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.2)] focus:border-[#2DB89B] focus:ring-1 focus:ring-[#2DB89B] h-12"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="whatsapp"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">WhatsApp Number</FormLabel>
        <FormControl>
          <Input
            type="tel"
            placeholder="+92 300 1234567"
            className="bg-[#0C1210] border-[rgba(45,184,155,0.12)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.2)] focus:border-[#2DB89B] focus:ring-1 focus:ring-[#2DB89B] h-12"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

<FormField
  control={form.control}
  name="goal"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">What do you want to achieve?</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="bg-[#0C1210] border-[rgba(45,184,155,0.12)] text-[#F0EDE6] focus:border-[#2DB89B] focus:ring-1 focus:ring-[#2DB89B] h-12 [&>span]:text-[rgba(240,237,230,0.2)] [&>span[data-placeholder]]:text-[rgba(240,237,230,0.2)]">
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-[#0C1210] border-[rgba(45,184,155,0.12)]">
          <SelectItem value="Land freelance/consulting clients" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Land freelance/consulting clients</SelectItem>
          <SelectItem value="Earn income in dollars" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Earn income in dollars</SelectItem>
          <SelectItem value="Automate my business with AI" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Automate my business with AI</SelectItem>
          <SelectItem value="Get a better job / advance my career" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Get a better job / advance my career</SelectItem>
          <SelectItem value="Learn AI skills to future-proof myself" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Learn AI skills to future-proof myself</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

<button
  type="submit"
  disabled={isSubmitting}
  className="w-full bg-gradient-to-br from-[#2DB89B] to-[#47ECCC] text-[#050907] font-['Sora',sans-serif] text-base sm:text-lg font-extrabold uppercase tracking-[3px] sm:tracking-[5px] py-5 sm:py-6 border-none cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(45,184,155,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(45,184,155,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
>
  {isSubmitting ? "Submitting..." : "Reserve Your Spot \u2014 Starting April 20"}
</button>
```

- [ ] **Step 5: Update post-submission confirmation steps**

Replace the steps array in the confirmation view:

```tsx
{[
  { step: "1", text: "A team member calls you within 48 hours" },
  { step: "2", text: "We walk you through the program and answer your questions" },
  { step: "3", text: "You're in \u2014 onboarding and community access begins" },
].map((item) => (
```

- [ ] **Step 6: Update confirmation paragraph**

Replace:
```tsx
A member of our team will contact you within <strong className="text-[rgba(240,237,230,0.9)]">48 hours</strong> to schedule your 15-minute assessment call.
```

With:
```tsx
A member of our team will call you within <strong className="text-[rgba(240,237,230,0.9)]">48 hours</strong> to walk you through the program.
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/Offer.tsx
git commit -m "feat: simplify lead capture form and update CTA for call-based sales"
```

---

### Task 9: Final Verification & Build

**Files:**
- Verify: `src/pages/Offer.tsx`

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Visual check (dev server)**

Run: `npm run dev`
Manually check:
1. Hero shows "Starts April 20" badge, new tagline and copy
2. Schedule banner renders with 4-column grid
3. Problem section shows with red-tinted X-mark pain points
4. Mission banner appears after Problem section with updated copy
5. Roadmap phase cards show updated bullets/outcomes
6. Value stack first item says "3 live classes/week + community building sessions"
7. Who This Is For has updated bullets
8. Form shows only 3 fields (name, WhatsApp, goal dropdown)
9. Button says "Reserve Your Spot — Starting April 20"
10. All animations and styling intact

- [ ] **Step 4: Test form submission**

Fill out the 3-field form and submit. Verify:
- Validation works (empty fields show errors)
- Submission hits Google Apps Script URL
- Confirmation view shows updated steps

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add src/pages/Offer.tsx
git commit -m "fix: address any issues found during verification"
```
