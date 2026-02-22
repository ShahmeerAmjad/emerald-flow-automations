// src/pages/Offer.tsx — AI Superpower Program Landing Page

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxNRHAy5x2dZQD1tKFOsxhn7SBwQbSioDbhlamjcwE8_OdajRenwzZJ7SMSrria4n9G/exec";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
  currentRole: z.string().min(2, "Please enter your current role"),
  aiExperience: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Please select your AI experience level",
  }),
  whyJoin: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(500, "Please keep it under 500 characters"),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

export default function Offer() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      currentRole: "",
      aiExperience: undefined,
      whyJoin: "",
    },
  });

  async function onSubmit(values: ApplicationValues) {
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "lead",
          ...values,
          timestamp: new Date().toISOString(),
        }),
      });
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="min-h-screen bg-[#050907] text-[#F0EDE6] font-['Sora',sans-serif] antialiased relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(45,184,155,0.1)_0%,transparent_70%)] animate-[orbFloat_22s_ease-in-out_infinite]" />
        <div className="absolute top-[1800px] -right-24 w-[500px] h-[500px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(240,168,48,0.05)_0%,transparent_70%)] animate-[orbFloat_26s_ease-in-out_infinite_-8s]" />
        <div className="absolute top-[3200px] -left-36 w-[600px] h-[600px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(91,141,239,0.05)_0%,transparent_70%)] animate-[orbFloat_24s_ease-in-out_infinite_-14s]" />
        <div className="absolute top-[4800px] left-1/2 w-[500px] h-[500px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(45,184,155,0.08)_0%,transparent_70%)] animate-[orbFloat_22s_ease-in-out_infinite_-4s]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-8 md:px-12 lg:px-[68px] py-10 sm:py-14 md:py-[60px]">

        {/* ═══ HERO ═══ */}
        <section className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 px-5 sm:px-7 py-2.5 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.07)] backdrop-blur-sm mb-7 sm:mb-9 animate-[fadeSlideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_both,borderGlow_4s_ease-in-out_infinite]">
            <span className="w-2 h-2 bg-[#47ECCC] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#2DB89B]" />
            <span className="font-['JetBrains_Mono',monospace] text-[11px] sm:text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium">
              Now Accepting Applications&ensp;·&ensp;Limited Cohort
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[78px] font-extrabold leading-[0.98] tracking-[-2px] sm:tracking-[-3px] lg:tracking-[-4px] mb-2 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
            <span className="font-light text-[rgba(240,237,230,0.5)]">THE</span>{" "}
            <span className="bg-gradient-to-br from-[#2DB89B] via-[#47ECCC] to-[#2DB89B] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_6s_linear_infinite]">
              AI SUPERPOWER
            </span>
            <br />
            PROGRAM
          </h1>

          <p className="text-base sm:text-lg md:text-[22px] text-[rgba(240,237,230,0.5)] font-normal mt-5 sm:mt-6 leading-[1.65] max-w-[800px] mx-auto animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
            A structured learning path from <strong className="text-[rgba(240,237,230,0.9)] font-semibold">complete beginner to full-stack AI builder.</strong>
            <br className="hidden sm:block" />
            We're building the <span className="text-[#47ECCC] font-semibold">most capable AI community in Pakistan</span> — and we're hand-picking who gets in.
          </p>

          <span className="inline-block mt-5 text-sm sm:text-base text-[rgba(240,237,230,0.28)] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.45s_both]">
            This isn't a course. It's a transformation. Applications closing soon.
          </span>
        </section>

        {/* ═══ MISSION BANNER ═══ */}
        <section className="p-6 sm:p-8 md:p-10 border border-[rgba(45,184,155,0.12)] bg-gradient-to-br from-[rgba(45,184,155,0.07)] to-transparent relative overflow-hidden animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2DB89B] to-transparent" />
          <span className="text-4xl block mb-4">🇵🇰</span>
          <h2 className="text-2xl sm:text-[30px] font-extrabold leading-[1.25] tracking-[-1px] mb-3">
            Pakistan will <span className="text-[#47ECCC]">not</span> be left behind.
          </h2>
          <p className="text-base sm:text-lg text-[rgba(240,237,230,0.5)] leading-[1.7] max-w-[820px]">
            The rest of the world is sprinting. AI is rewriting every industry, every job, every skill that matters.{" "}
            <strong className="text-[rgba(240,237,230,0.9)] font-semibold">We refuse to let Pakistan watch from the sidelines.</strong>{" "}
            This program exists to build a generation of AI-powered Pakistanis who can compete head-on with anyone on the planet — and win.
            We're not just teaching tools. We're building a <strong className="text-[rgba(240,237,230,0.9)] font-semibold">community of builders, earners, and leaders</strong> who will define what Pakistan's future looks like.
          </p>
        </section>

        <Separator />

        {/* ═══ 3-LEVEL PATH OVERVIEW ═══ */}
        <div className="mb-6">
          <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-2">Your Learning Path</div>
          <div className="text-[17px] text-[rgba(240,237,230,0.28)]">Three levels. One destination: you become dangerous with AI.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr_40px_1fr] gap-4 md:gap-0 items-stretch animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.2s_both]">
          <PathCard level="l1" label="Level 0 → 1" name="Starter Pack" tagline="AI Thinking &amp; Foundations" />
          <PathArrow />
          <PathCard level="l2" label="Level 2" name="Builder" tagline="Workflows, Agents &amp; Monetization" />
          <PathArrow />
          <PathCard level="l3" label="Level 3" name="Agentic" tagline="Full-Stack AI &amp; Deployment" />
        </div>

        <Separator />

        {/* ═══ LEVEL 0→1: STARTER PACK ═══ */}
        <LevelSection
          level="l1"
          badge="Level 0 → 1"
          title="Starter Pack — AI Foundations"
          subtitle="For anyone starting from zero. You'll think, prompt, and create like a pro."
          learns={[
            "Develop an AI-first mindset — understand what's happening and why it matters to your career",
            "Master the art of asking the right questions and writing prompts that get real results",
            "Navigate ChatGPT, Claude, and Gemini — know when to use which and why",
            "Generate professional images with AI for content, branding, and client work",
            "Build and ship a production-ready website using Loveable — no coding needed",
          ]}
          outcomes={[
            "Confidence to use AI daily in your work and side projects",
            "A portfolio-ready website you built and launched yourself",
            "Prompt engineering skills that 95% of people don't have",
            "The ability to create visual content without hiring a designer",
            "A foundation that makes Level 2 and 3 feel effortless",
          ]}
          tools={["ChatGPT", "Claude", "Gemini", "Image Gen", "Loveable", "Prompt Engineering"]}
        />

        <Separator />

        {/* ═══ LEVEL 2: BUILDER ═══ */}
        <LevelSection
          level="l2"
          badge="Level 2"
          title="Builder — Workflows, Agents & Monetization"
          subtitle="This is where you start making money. Automate, create, and freelance with AI."
          learns={[
            "Build powerful automations with Make.com and n8n that run entire business processes",
            "Create AI-generated videos and voice content — scale without a camera or mic",
            "Implement RAG and vectorization for intelligent document retrieval systems",
            "Scrape and collect data at scale with Apify and Firecrawl",
            "Learn Python basics, APIs, JSON, databases, and React to build real products",
            "Optimize your freelancing profile and start landing AI-related clients",
          ]}
          outcomes={[
            "Working automations you can sell as services to businesses",
            "AI video and voice content creation skills worth Rs 50K+/month",
            "A freelancer profile positioned to attract high-ticket clients",
            "Technical skills (APIs, Python, React) that command premium rates",
            "The ability to solve real business problems — not just play with tools",
          ]}
          tools={["Make.com", "n8n", "Video Gen", "Voice AI", "Manus", "Apify", "Firecrawl", "Python", "API / JSON", "React", "Database"]}
        />

        <Separator />

        {/* ═══ LEVEL 3: AGENTIC ═══ */}
        <LevelSection
          level="l3"
          badge="Level 3"
          title="Agentic — Full-Stack AI & Deployment"
          subtitle="The top 1%. Build autonomous agents, deploy to production, and own the stack."
          learns={[
            "Build with Claude Code and Clawd bot — ship AI-powered tools from your terminal",
            "Deploy on VPS with Docker — own your infrastructure, not just borrow it",
            "Orchestrate multi-agent systems with LangChain and CrewAI",
            "Use GitHub like a pro — version control, collaboration, open source",
            "Create skills and markdown files that make your AI agents 10x more capable",
          ]}
          outcomes={[
            "The ability to build and deploy full-stack AI products from scratch",
            "Autonomous agents running on your own servers 24/7",
            "Skills that put you in the top 1% of AI practitioners in Pakistan",
            "A GitHub portfolio that speaks for itself to any employer or client",
            "The power to build an AI agency, SaaS, or consulting business",
          ]}
          tools={["Claude Code", "Clawd Bot", "VPS + Docker", "LangChain", "CrewAI", "GitHub", "Skills & MD Files"]}
        />

        <Separator />

        {/* ═══ WHO IS THIS FOR ═══ */}
        <section>
          <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">Who This Is For</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* For you */}
            <div className="p-6 sm:p-8 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.03)] hover:border-[rgba(45,184,155,0.25)] hover:bg-[rgba(45,184,155,0.05)] transition-all">
              <h3 className="text-[17px] font-extrabold uppercase tracking-[2px] text-[#47ECCC] mb-5">You belong here if</h3>
              {[
                "You're a freelancer who wants to offer AI services at premium rates",
                "You're a business owner watching competitors automate while you're stuck",
                "You're a student who wants skills that actually lead to income",
                "You're ready to commit, show up, and build — not just watch",
                "You believe Pakistan deserves a seat at the AI table",
              ].map((line, i) => (
                <div key={i} className="text-[17px] leading-[1.6] mb-3 pl-7 relative text-[rgba(240,237,230,0.7)]">
                  <span className="absolute left-0 top-0.5 text-[#47ECCC] font-bold text-[15px]">✓</span>
                  {line}
                </div>
              ))}
            </div>
            {/* Not for you */}
            <div className="p-6 sm:p-8 border border-[rgba(240,96,80,0.08)] bg-[rgba(240,96,80,0.02)] hover:border-[rgba(240,96,80,0.15)] transition-all">
              <h3 className="text-[17px] font-extrabold uppercase tracking-[2px] text-[#E8705F] mb-5">Not for you if</h3>
              {[
                "You want shortcuts without putting in the reps",
                "You think AI is a passing trend",
                "You won't implement what you learn",
                "You want motivation speeches — this is execution",
                "You're comfortable where you are right now",
              ].map((line, i) => (
                <div key={i} className="text-[17px] leading-[1.6] mb-3 pl-7 relative text-[rgba(240,237,230,0.7)]">
                  <span className="absolute left-0 top-0.5 text-[#E8705F] font-bold">✕</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* ═══ CTA — WAITLIST ═══ */}
        <section className="text-center p-8 sm:p-10 md:p-14 border border-[rgba(45,184,155,0.12)] bg-gradient-to-b from-[rgba(45,184,155,0.06)] via-[rgba(45,184,155,0.02)] to-[rgba(45,184,155,0.04)] animate-[glowPulse_4s_ease-in-out_infinite] relative overflow-hidden">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[300px] h-0.5 bg-gradient-to-r from-transparent via-[#47ECCC] to-transparent" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(45,184,155,0.06),transparent_70%)] pointer-events-none" />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-1px] sm:tracking-[-1.5px] leading-[1.2] mb-4 relative z-10">
            We're Not Selling a Course.<br />
            We're <span className="text-[#47ECCC]">Building a Movement.</span>
          </h2>

          <p className="text-base sm:text-lg md:text-[19px] text-[rgba(240,237,230,0.5)] leading-[1.65] max-w-[680px] mx-auto mb-3 relative z-10">
            We're gathering the first cohort of serious builders who want to be part of something bigger than a course — <strong className="text-[rgba(240,237,230,0.9)]">a community, a support system, and a launchpad</strong> for Pakistan's AI future. Join the waitlist to show us you're serious, and we'll build this together.
          </p>

          {isSubmitted ? (
            /* ═══ CONFIRMATION VIEW ═══ */
            <div className="relative z-10 py-4">
              <CheckCircle className="w-14 h-14 text-[#47ECCC] mx-auto mb-5" />
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-[-1px] mb-3">
                Application Received!
              </h3>
              <p className="text-base sm:text-lg text-[rgba(240,237,230,0.5)] leading-[1.65] max-w-[560px] mx-auto mb-8">
                A member of our team will contact you within <strong className="text-[rgba(240,237,230,0.9)]">48 hours</strong> to schedule your 15-minute assessment call.
              </p>

              <div className="text-left max-w-[440px] mx-auto p-6 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.04)]">
                <div className="font-['JetBrains_Mono',monospace] text-xs tracking-[3px] uppercase text-[#2DB89B] font-medium mb-4">
                  What happens next?
                </div>
                {[
                  { step: "1", text: "15-minute assessment call with our team" },
                  { step: "2", text: "Cohort selection — we pick the best fit" },
                  { step: "3", text: "Onboarding & you start building with AI" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 mb-3 last:mb-0">
                    <span className="shrink-0 w-7 h-7 flex items-center justify-center bg-[rgba(45,184,155,0.1)] border border-[rgba(45,184,155,0.2)] font-['JetBrains_Mono',monospace] text-xs text-[#47ECCC] font-bold">
                      {item.step}
                    </span>
                    <span className="text-[15px] text-[rgba(240,237,230,0.7)] leading-[1.5] pt-0.5">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ═══ APPLICATION FORM ═══ */
            <div className="relative z-10">
              <div className="font-['JetBrains_Mono',monospace] text-sm text-[#47ECCC] tracking-[2px] mb-8">
                NOW ACCEPTING APPLICATIONS
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[560px] mx-auto space-y-5 text-left">
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="bg-[#0C1210] border-[rgba(45,184,155,0.12)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.2)] focus:border-[#2DB89B] focus:ring-1 focus:ring-[#2DB89B] h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                    <FormField
                      control={form.control}
                      name="currentRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">Current Role</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Freelancer, Student"
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
                    name="aiExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">AI Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#0C1210] border-[rgba(45,184,155,0.12)] text-[#F0EDE6] focus:border-[#2DB89B] focus:ring-1 focus:ring-[#2DB89B] h-12 [&>span]:text-[rgba(240,237,230,0.2)] [&>span[data-placeholder]]:text-[rgba(240,237,230,0.2)]">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#0C1210] border-[rgba(45,184,155,0.12)]">
                            <SelectItem value="Beginner" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Beginner — New to AI</SelectItem>
                            <SelectItem value="Intermediate" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Intermediate — Used AI tools</SelectItem>
                            <SelectItem value="Advanced" className="text-[#F0EDE6] focus:bg-[rgba(45,184,155,0.1)] focus:text-[#F0EDE6]">Advanced — Built with AI</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whyJoin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">Why do you want to join?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what you hope to achieve with AI..."
                            className="bg-[#0C1210] border-[rgba(45,184,155,0.12)] text-[#F0EDE6] placeholder:text-[rgba(240,237,230,0.2)] focus:border-[#2DB89B] focus:ring-1 focus:ring-[#2DB89B] min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-br from-[#2DB89B] to-[#47ECCC] text-[#050907] font-['Sora',sans-serif] text-base sm:text-lg font-extrabold uppercase tracking-[3px] sm:tracking-[5px] py-5 sm:py-6 border-none cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(45,184,155,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(45,184,155,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </Form>
            </div>
          )}

          {/* FOMO Box */}
          <div className="mt-8 p-5 sm:p-6 bg-[rgba(240,96,80,0.04)] border border-[rgba(240,96,80,0.1)] inline-block max-w-[660px] animate-[fomoGlow_3s_ease-in-out_infinite] relative z-10">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 bg-[#F06050] rounded-full animate-[livePulse_1s_ease-in-out_infinite] shadow-[0_0_12px_#F06050]" />
              <span className="font-['JetBrains_Mono',monospace] text-sm sm:text-[15px] text-[#F06050] tracking-[3px] uppercase font-bold">
                Only 10 spots in the first cohort
              </span>
            </div>
            <p className="text-sm sm:text-base text-[rgba(240,237,230,0.7)] leading-[1.7]">
              This is <strong className="text-[#F0EDE6] font-bold">not</strong> an open enrollment. We're hand-selecting <strong className="text-[#F0EDE6] font-bold">10 people</strong> for the founding cohort — people who are ready to put in the work and represent the standard we're setting. Once the 10 are in,{" "}
              <span className="text-[#E8705F] font-bold">the waitlist closes and you'll have to wait for the next cohort.</span>{" "}
              We don't know when that will be. If you're reading this, there's still a spot with your name on it. <strong className="text-[#F0EDE6] font-bold">But not for long.</strong>
            </p>
          </div>

          <p className="text-base sm:text-[17px] text-[rgba(240,237,230,0.5)] mt-7 leading-[1.6] relative z-10">
            This is your signal. The world is changing <strong className="text-[#F0EDE6]">right now.</strong>
            <br />
            The question isn't whether AI will transform Pakistan.
            <br />
            It's whether <span className="text-[#47ECCC] font-bold">you'll be the one leading it.</span>
          </p>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="text-center pt-9 pb-6">
          <div className="text-[26px] font-bold tracking-[-0.5px] mb-2.5">
            <span className="text-[#2DB89B]">Sas</span>
            <span className="text-[#EDE8D0]">Solutions.ai</span>
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-xs text-[rgba(240,237,230,0.28)] tracking-[3px] uppercase">
            The future belongs to <span className="text-[#2DB89B]">those who build</span> — not those who watch
          </div>
        </footer>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(40px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.5); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(45, 184, 155, 0.06); }
          50% { box-shadow: 0 0 44px rgba(45, 184, 155, 0.16); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(45, 184, 155, 0.1); }
          50% { border-color: rgba(45, 184, 155, 0.3); }
        }
        @keyframes fomoGlow {
          0%, 100% { border-color: rgba(240, 96, 80, 0.08); }
          50% { border-color: rgba(240, 96, 80, 0.25); }
        }
      `}</style>
    </div>
  );
}

/* ═══ SUBCOMPONENTS ═══ */

function Separator() {
  return (
    <div className="relative my-10 sm:my-14 h-px bg-gradient-to-r from-transparent via-[rgba(45,184,155,0.25)] to-transparent">
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2DB89B] rounded-full opacity-50" />
    </div>
  );
}

const levelColors = {
  l1: { accent: "#47ECCC", border: "rgba(71,236,204,0.2)", bg: "rgba(71,236,204,0.04)", barBg: "linear-gradient(90deg,#2DB89B,#47ECCC)" },
  l2: { accent: "#F0A830", border: "rgba(240,168,48,0.2)", bg: "rgba(240,168,48,0.04)", barBg: "linear-gradient(90deg,#F0A830,#FFD080)" },
  l3: { accent: "#5B8DEF", border: "rgba(91,141,239,0.2)", bg: "rgba(91,141,239,0.04)", barBg: "linear-gradient(90deg,#5B8DEF,#90B8FF)" },
} as const;

function PathCard({ level, label, name, tagline }: { level: "l1" | "l2" | "l3"; label: string; name: string; tagline: string }) {
  const c = levelColors[level];
  return (
    <div
      className="p-6 sm:p-8 border border-[rgba(45,184,155,0.06)] bg-[#0C1210] text-center relative transition-all duration-[400ms] hover:-translate-y-1 hover:border-[rgba(45,184,155,0.12)]"
      style={{ borderTopColor: c.accent }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.barBg }} />
      <div className="font-['JetBrains_Mono',monospace] text-xs tracking-[4px] uppercase mb-2" style={{ color: c.accent }}>{label}</div>
      <div className="text-xl sm:text-2xl font-extrabold tracking-[-0.5px] mb-1.5">{name}</div>
      <div className="text-sm text-[rgba(240,237,230,0.28)] leading-[1.4]" dangerouslySetInnerHTML={{ __html: tagline }} />
    </div>
  );
}

function PathArrow() {
  return (
    <div className="hidden md:flex items-center justify-center text-[rgba(240,237,230,0.13)] text-2xl relative">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-[rgba(45,184,155,0.06)] animate-[pathPulse_3s_ease-in-out_infinite]" />
      <span className="relative z-10 bg-[#050907] px-1 text-[rgba(240,237,230,0.28)]">→</span>
      <style>{`@keyframes pathPulse { 0%,100%{opacity:0.15} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

function LevelSection({
  level,
  badge,
  title,
  subtitle,
  learns,
  outcomes,
  tools,
}: {
  level: "l1" | "l2" | "l3";
  badge: string;
  title: string;
  subtitle: string;
  learns: string[];
  outcomes: string[];
  tools: string[];
}) {
  const c = levelColors[level];
  return (
    <section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 sm:mb-7">
        <span
          className="font-['JetBrains_Mono',monospace] text-[13px] font-bold tracking-[3px] uppercase px-5 py-2.5 shrink-0 self-start"
          style={{ color: c.accent, border: `1px solid ${c.border}`, background: c.bg }}
        >
          {badge}
        </span>
        <div>
          <h3 className="text-xl sm:text-2xl md:text-[28px] font-extrabold tracking-[-1px] mb-1">{title}</h3>
          <p className="text-sm sm:text-base text-[rgba(240,237,230,0.28)]">{subtitle}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* What You'll Learn */}
        <div className="p-6 sm:p-8 border border-[rgba(45,184,155,0.06)] bg-[#0C1210]">
          <h4 className="text-[15px] font-bold uppercase tracking-[2px] text-[rgba(240,237,230,0.5)] mb-5">What You'll Learn</h4>
          {learns.map((item, i) => (
            <div key={i} className="text-[15px] sm:text-[17px] leading-[1.55] mb-3.5 pl-7 relative text-[rgba(240,237,230,0.7)]">
              <span className="absolute left-0 top-0 font-bold text-base" style={{ color: c.accent }}>▸</span>
              {item}
            </div>
          ))}
        </div>

        {/* What You Walk Away With */}
        <div
          className="p-6 sm:p-8 flex flex-col justify-between"
          style={{ border: `1px solid ${c.border.replace("0.2", "0.1")}`, background: c.bg.replace("0.04", "0.02") }}
        >
          <div>
            <h4 className="text-[15px] font-bold uppercase tracking-[2px] mb-5" style={{ color: c.accent }}>What You Walk Away With</h4>
            {outcomes.map((item, i) => (
              <div key={i} className="text-[15px] sm:text-[17px] leading-[1.55] mb-3.5 pl-7 relative text-[rgba(240,237,230,0.7)]">
                <span className="absolute left-0 top-0 font-bold text-base" style={{ color: c.accent }}>→</span>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(45,184,155,0.06)]">
            <div className="font-['JetBrains_Mono',monospace] text-[11px] text-[rgba(240,237,230,0.28)] tracking-[3px] uppercase mb-2.5">Tools You'll Master</div>
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool, i) => (
                <span key={i} className="font-['JetBrains_Mono',monospace] text-[11px] px-3 py-1.5 bg-[#050907] border border-[rgba(45,184,155,0.06)] text-[rgba(240,237,230,0.5)] tracking-[0.5px] hover:border-[rgba(45,184,155,0.12)] hover:text-[rgba(240,237,230,0.7)] transition-all">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
