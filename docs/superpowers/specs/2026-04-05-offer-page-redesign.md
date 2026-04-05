# Offer Page Redesign — Hormozi-Style Lead Capture & Consulting Positioning

**Date:** 2026-04-05
**Status:** Approved
**File:** `src/pages/Offer.tsx`

---

## Overview

Redesign the Offer page to reposition the AI Advantage Program around a **consulting mindset** — landing clients, solving real business problems, earning dollars, and being future-ready. Simplify the form from 6 fields to 3 for outbound call-based sales. Add schedule visibility and a problem-agitation section.

## Course Details

- **Start date:** April 20, 2026
- **Schedule:** Tuesday & Thursday 7:00–8:30 PM, 1 weekend session (Saturday or Sunday afternoon)
- **Format:** 100% online, live classes
- **Duration:** 8 weeks (6 weeks learning + 2 weeks project incubator)
- **Pricing:** Rs 65,000 (unchanged)

---

## Page Flow

```
1. Hero (rewritten)
2. Schedule Banner (NEW)
3. The Problem (NEW)
4. Mission Banner (moved from after hero, copy updated)
5. 8-Week Roadmap (copy updated)
6. Value Stack (minor update)
7. Who This Is For (copy updated)
8. Lead Capture Form (simplified)
9. Footer (unchanged)
```

---

## Section 1: Hero

**Badge:** `Starts April 20 · Cohort 1 · Limited Seats`

**Headline:**
```
THE AI ADVANTAGE PROGRAM
Become The Person Businesses Call
```

**Subhead:**
> In 8 weeks, go from "I should learn AI" to landing real clients, solving real business problems, and earning dollars — with a consulting mindset that makes you indispensable in 2026 and beyond.

**Sub-line:**
> 6 weeks of intensive learning. 2 weeks building your own AI consulting project. One career-defining transformation.

**Changes:**
- Badge shows start date instead of "Founding Member Pricing"
- Tagline: "Become The Person Businesses Call" replaces "Unlock Your Superpower"
- Copy leads with clients, business problems, and earning

---

## Section 2: Schedule Banner (NEW)

Placed immediately after hero. Bordered card with green accent bar on top.

**4-column grid layout:**

| Label | Value |
|-------|-------|
| Start Date | April 20, 2026 |
| Weekday Classes | Tuesday & Thursday, 7:00 – 8:30 PM |
| Weekend Session | Saturday or Sunday, Afternoon |
| Format | 100% Online · Live & Together |

**Below grid:**
> 3 live sessions/week. You don't learn AI alone — you build alongside a community of driven builders who push each other forward.

**Style:** Dark card (`bg-[#0C1210]`), `border-[rgba(45,184,155,0.12)]`, green accent bar top, JetBrains Mono labels.

---

## Section 3: The Problem (NEW)

Hormozi-style pain agitation before presenting the solution (roadmap).

**Label:** `THE PROBLEM`

**Headline:**
> Everyone's "Learning AI." Nobody's **Earning** From It.

**Pain points (X-mark style, similar to "Not for you if"):**
- You've watched 100 YouTube tutorials and still can't land a single client
- You know how to prompt ChatGPT but have no idea how to turn that into income
- Every course teaches you tools — none teach you how to solve real business problems
- You're "learning AI" but your career path looks exactly the same as it did last year
- The world is hiring AI consultants and you're stuck wondering where to even start

**Closing line:**
> This program doesn't teach you AI tools and wish you luck. It turns you into the person businesses pay to solve their problems.

**Style:** Dark card with subtle red/amber tint (like the existing "Not for you if" block) for visual contrast before the green roadmap.

---

## Section 4: Mission Banner (Moved + Updated)

**Moved from:** after hero → **after Problem section, before Roadmap**

**Headline:** Pakistan will **not** be left behind. (unchanged)

**Body (rewritten):**
> The rest of the world is hiring AI consultants at $50–150/hour. Pakistani talent has the skills, the hunger, and the hustle — but not the right training. We're not teaching you to pass a quiz. We're building a community of AI consultants who land global clients, solve real business problems, and prove that Pakistan competes with anyone on the planet.

---

## Section 5: 8-Week Roadmap (Copy Updated)

Phase card structure, colors, and component stay the same. Bullets and outcomes reframed from "tools learned" to "problems solved / client value delivered."

### Phase 1: Foundations (Weeks 1-2)
**Bullets:**
- Develop an AI-first consulting mindset for work & business
- Master prompts that deliver client-ready output, not just "cool" responses
- Build a website for your AI consulting practice
- Create professional visuals and branding with AI

**Outcomes:**
- Confidence to walk into any business and show them what AI can do
- A live website you built and launched yourself
- Prompt skills that 95% of professionals don't have

**Tools:** ChatGPT, Claude, Gemini, Midjourney, Loveable (unchanged)

### Phase 2: Builder (Weeks 3-4)
**Bullets:**
- Build automations you can package and sell to local businesses
- Content systems that replace entire marketing teams
- Data scraping and lead generation for clients
- Learn Python basics, APIs & connect everything into real solutions
- Turn one piece of content into 10 with AI repurposing

**Outcomes:**
- 3–5 packaged AI services you can pitch to businesses this week
- A content creation workflow that replaces a whole team
- Technical skills that set you apart from every other freelancer

**Tools:** Make.com, n8n, HeyGen, ElevenLabs, CapCut, Apify, Python (unchanged)

### Phase 3: Agentic (Weeks 5-6)
**Bullets:**
- Build AI-powered apps with Claude Code
- Deploy AI agents that run 24/7 for clients
- Custom chatbots and assistants businesses will pay for
- Master GitHub & version control like a real developer
- Deploy Skills & MCPs within Claude Code to build multiple AI agents

**Outcomes:**
- You can now build what most agencies charge $5,000–$10,000 for
- Your own AI agents running 24/7 on autopilot
- A GitHub portfolio that proves you're the real deal

**Tools:** Claude Code, Skills, MCPs, Docker, GitHub, Vercel (unchanged)

### Phase 4: Incubator (Weeks 7-8)
**Bullets:**
- Apply everything you learned to build YOUR project
- 1-on-1 mentor guidance throughout
- Weekly project reviews & feedback
- Launch something real — a product, a client project, or your consulting practice

**Outcomes:**
- A finished AI product you built and launched
- Real portfolio proof to show clients or employers
- The confidence to build anything with AI

**Tools:** (none, unchanged)

---

## Section 6: Value Stack (Minor Update)

**Only change:** First line item description updated:
- From: `"2 classes/week + 1 TA help session for those who need extra support"`
- To: `"3 live classes/week + community building sessions"`

All pricing, line items, "Rs 1,000/day" breakdown, urgency elements stay exactly as-is.

---

## Section 7: Who This Is For (Copy Updated)

Two-column structure stays the same.

### "You belong here if"
- You're tired of learning AI in isolation and want to build alongside a driven community
- You're a freelancer who wants to offer AI consulting services and charge in dollars
- You're a student who wants real skills that lead to real clients, not just a certificate
- You're a business owner who wants to automate operations and solve problems with AI
- You're ready to invest 8 weeks to become the person businesses call for AI solutions

### "Not for you if"
- You want a certificate to hang on the wall — this is about landing clients and earning
- You can't commit to 3 live sessions per week and the assignments
- You think learning AI means memorizing prompts — we build real solutions here
- You want someone to hand you clients — we teach you how to win them yourself
- You're looking for passive income with zero effort — consulting takes real work

---

## Section 8: Lead Capture Form (Simplified)

### Form Fields (3 total, down from 6)

| Field | Type | Validation |
|-------|------|------------|
| Full Name | Text input | Min 2 chars |
| WhatsApp Number | Tel input | Min 10 digits |
| What do you want to achieve? | Select dropdown | Required |

### Dropdown Options
- Land freelance/consulting clients
- Earn income in dollars
- Automate my business with AI
- Get a better job / advance my career
- Learn AI skills to future-proof myself

### Removed Fields
- Email (not needed for call-based sales)
- Current Role
- Why do you want to join? (textarea)

### CTA Copy

**Heading:** Your Transformation Starts With **One Call.**

**Sub-line:** Reserve your spot and a member of our team will call you within **48 hours** to walk you through the program.

**Button text:** `Reserve Your Spot — Starting April 20`

**Form label above fields:** `RESERVE YOUR SPOT`

### Post-Submission Confirmation

**Steps updated:**
1. A team member calls you within 48 hours
2. We walk you through the program and answer your questions
3. You're in — onboarding and community access begins

---

## Section 9: Footer

No changes.

---

## Schema Changes

**Zod schema update:**
- Remove: `email`, `currentRole`, `aiExperience`, `whyJoin`
- Add: `goal` (enum of the 5 dropdown options)
- Keep: `fullName`, `whatsapp`

**Google Apps Script payload:** Will now send `fullName`, `whatsapp`, `goal`, `timestamp` instead of the previous 6 fields.

---

## What Does NOT Change

- Dark theme (`bg-[#050907]`), all colors, fonts (Sora, JetBrains Mono)
- All animations (orbFloat, fadeSlideUp, shimmer, livePulse, glowPulse, borderGlow, fomoGlow)
- Ambient orbs background
- PhaseCard component structure and color system
- Separator component
- Value stack pricing (Rs 65,000 / Rs 325,000 total)
- FOMO box and urgency elements
- Footer
- Vercel deployment config
