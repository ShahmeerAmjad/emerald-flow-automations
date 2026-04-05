// src/pages/Offer.tsx — AI Advantage Program Landing Page (Hormozi Grand Slam Offer)

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzeVb68IunL6BM6AOC5tleIh8mGkHkV4lXkoHJVzKYTL57CXhdmsvJDYrgTow3A9JKV3g/exec";

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

type ApplicationValues = z.infer<typeof applicationSchema>;

export default function Offer() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      whatsapp: "",
      goal: undefined,
    },
  });

  async function onSubmit(values: ApplicationValues) {
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          eventType: "lead",
          ...values,
          timestamp: new Date().toISOString(),
        }),
      });
      setIsSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
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
              Starts April 20&ensp;·&ensp;Cohort 1&ensp;·&ensp;Limited Seats
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
            Become The Person Businesses Call
          </div>

          <p className="text-base sm:text-lg md:text-[22px] text-[rgba(240,237,230,0.5)] font-normal leading-[1.65] max-w-[800px] mx-auto animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
            In 8 weeks, go from <strong className="text-[rgba(240,237,230,0.9)] font-semibold">"I should learn AI"</strong> to landing real clients, solving real business problems, and earning dollars — with a consulting mindset that makes you indispensable in 2026 and beyond.
            <br className="hidden sm:block" />
            6 weeks of intensive learning. 2 weeks of <span className="text-[#47ECCC] font-semibold">building your own AI consulting project</span>. One career-defining transformation.
          </p>

          <span className="inline-block mt-5 text-sm sm:text-base text-[rgba(240,237,230,0.28)] animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.45s_both]">
            Limited spots in Cohort 1. Your seat won't wait.
          </span>
        </section>

        <ScheduleBanner />

        <Separator />

        <ProblemSection />

        <Separator />

        {/* ═══ MISSION BANNER ═══ */}
        <section className="p-6 sm:p-8 md:p-10 border border-[rgba(45,184,155,0.12)] bg-gradient-to-br from-[rgba(45,184,155,0.07)] to-transparent relative overflow-hidden animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2DB89B] to-transparent" />
          <span className="text-4xl block mb-4">🇵🇰</span>
          <h2 className="text-2xl sm:text-[30px] font-extrabold leading-[1.25] tracking-[-1px] mb-3">
            Pakistan will <span className="text-[#47ECCC]">not</span> be left behind.
          </h2>
          <p className="text-base sm:text-lg text-[rgba(240,237,230,0.5)] leading-[1.7] max-w-[820px]">
            The rest of the world is hiring AI consultants at $50–150/hour. Pakistani talent has the skills, the hunger, and the hustle — but not the right training.{" "}
            <strong className="text-[rgba(240,237,230,0.9)] font-semibold">We're not teaching you to pass a quiz.</strong>{" "}
            We're building a community of AI consultants who land global clients, solve real business problems, and prove that Pakistan competes with anyone on the planet.
          </p>
        </section>

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
          </div>
        </section>

        <Separator />

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

          {/* Total & Pricing */}
          <div className="mt-8 pt-6 border-t border-[rgba(45,184,155,0.2)]">
            <div className="flex flex-col gap-4">
              <div>
                <div className="font-['JetBrains_Mono',monospace] text-xs tracking-[3px] uppercase text-[rgba(240,237,230,0.4)] mb-1">Total Value</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[rgba(240,96,80,0.5)] tracking-[-1px] line-through">
                  Rs 325,000
                </div>
              </div>
              <div>
                <div className="font-['JetBrains_Mono',monospace] text-xs tracking-[3px] uppercase text-[#2DB89B] font-medium mb-1">Founding Member Price</div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#47ECCC] tracking-[-2px]">
                  Rs 65,000
                </div>
                <span className="inline-block mt-2 font-['JetBrains_Mono',monospace] text-[11px] tracking-[2px] uppercase px-3 py-1.5 bg-[rgba(45,184,155,0.1)] border border-[rgba(45,184,155,0.2)] text-[#47ECCC] font-bold">
                  You Save Rs 260,000 — 80% Off
                </span>
              </div>

              {/* Daily cost breakdown */}
              <div className="font-['JetBrains_Mono',monospace] text-sm text-[rgba(240,237,230,0.5)] tracking-[1px] leading-[1.7]">
                That's Rs 1,000/day. Less than what we spend on things we won't even remember tomorrow. You choose — spend on consumption, or invest in gaining an unfair advantage.
                <br />
                <span className="text-[rgba(240,237,230,0.7)]">Are you willing to invest Rs 1,000/day in yourself?</span>
              </div>

              {/* Payment info */}
              <div className="text-sm text-[rgba(240,237,230,0.3)]">
                One-time payment · Monthly installments available on special request
              </div>

              {/* Spots remaining */}
              <div className="flex items-center gap-2.5 mt-2">
                <span className="w-2.5 h-2.5 bg-[#F06050] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_12px_#F06050]" />
                <span className="font-['JetBrains_Mono',monospace] text-sm tracking-[3px] uppercase text-[#F06050] font-bold">
                  Only 2 spots left in Cohort 1
                </span>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ═══ WHO IS THIS FOR ═══ */}
        <section>
          <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">Who This Is For</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* For you */}
            <div className="p-6 sm:p-8 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.03)] hover:border-[rgba(45,184,155,0.25)] hover:bg-[rgba(45,184,155,0.05)] transition-all">
              <h3 className="text-[17px] font-extrabold uppercase tracking-[2px] text-[#47ECCC] mb-5">You belong here if</h3>
              {[
                "You're tired of learning AI in isolation and want to build alongside a driven community",
                "You're a freelancer who wants to offer AI consulting services and charge in dollars",
                "You're a student who wants real skills that lead to real clients, not just a certificate",
                "You're a business owner who wants to automate operations and solve problems with AI",
                "You're ready to invest 8 weeks to become the person businesses call for AI solutions",
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
                "You want a certificate to hang on the wall \u2014 this is about landing clients and earning",
                "You can't commit to 3 live sessions per week and the assignments",
                "You think learning AI means memorizing prompts \u2014 we build real solutions here",
                "You want someone to hand you clients \u2014 we teach you how to win them yourself",
                "You're looking for passive income with zero effort \u2014 consulting takes real work",
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
            Your Transformation Starts<br />
            With <span className="text-[#47ECCC]">One Application.</span>
          </h2>

          <p className="text-base sm:text-lg md:text-[19px] text-[rgba(240,237,230,0.5)] leading-[1.65] max-w-[680px] mx-auto mb-3 relative z-10">
            We're not selling a course. We're building a movement. Apply now and a member of our team will contact you within <strong className="text-[rgba(240,237,230,0.9)]">48 hours</strong>.
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
                  { step: "2", text: "Cohort selection, we pick the best fit" },
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
                              <SelectValue placeholder="Select your primary goal" />
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
                    {isSubmitting ? "Submitting..." : "Apply Now \u2014 Limited Spots"}
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
                Limited seats in Cohort 1
              </span>
            </div>
            <p className="text-sm sm:text-base text-[rgba(240,237,230,0.7)] leading-[1.7]">
              This is <strong className="text-[#F0EDE6] font-bold">not</strong> an open enrollment. We're hand-selecting a <strong className="text-[#F0EDE6] font-bold">small founding cohort</strong> of people who are ready to put in the work and represent the standard we're setting. Once the seats are filled,{" "}
              <span className="text-[#E8705F] font-bold">applications close and you'll have to wait for the next cohort.</span>{" "}
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

const valueStack = [
  { name: "8-Week AI Advantage Program", desc: "3 live classes/week + community building sessions", value: "150,000" },
  { name: "Private Community + Weekly Mentorship Calls", desc: "Direct access to mentors & peer network", value: "50,000" },
  { name: "Prompt Library + Automation Templates + AI Toolkit", desc: "Battle-tested templates you can use immediately", value: "30,000" },
  { name: "Your Own AI Portfolio You Built From Scratch", desc: "Real projects you can show clients, employers, or investors", value: "25,000" },
  { name: "Lifetime Access to Recordings + Future Updates", desc: "Alumni network & all future cohort materials", value: "70,000" },
] as const;

const phaseColors = {
  foundations: { accent: "#47ECCC", border: "rgba(71,236,204,0.2)", bg: "rgba(71,236,204,0.04)", barBg: "linear-gradient(90deg,#2DB89B,#47ECCC)" },
  builder: { accent: "#F0A830", border: "rgba(240,168,48,0.2)", bg: "rgba(240,168,48,0.04)", barBg: "linear-gradient(90deg,#F0A830,#FFD080)" },
  agentic: { accent: "#5B8DEF", border: "rgba(91,141,239,0.2)", bg: "rgba(91,141,239,0.04)", barBg: "linear-gradient(90deg,#5B8DEF,#90B8FF)" },
  incubator: { accent: "#47ECCC", border: "rgba(71,236,204,0.3)", bg: "rgba(71,236,204,0.06)", barBg: "linear-gradient(90deg,#2DB89B,#F0A830)" },
} as const;

type PhaseKey = keyof typeof phaseColors;

function PhaseCard({
  phase,
  weeks,
  name,
  bullets,
  outcomes,
  tools,
  isIncubator,
}: {
  phase: PhaseKey;
  weeks: string;
  name: string;
  bullets: string[];
  outcomes: string[];
  tools: string[];
  isIncubator?: boolean;
}) {
  const c = phaseColors[phase];
  return (
    <div
      className={`p-6 sm:p-8 border bg-[#0C1210] relative transition-all duration-[400ms] hover:-translate-y-1 flex flex-col ${
        isIncubator
          ? "border-[rgba(71,236,204,0.2)]"
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
      {outcomes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[rgba(45,184,155,0.06)]">
          <div className="font-['JetBrains_Mono',monospace] text-[11px] text-[rgba(240,237,230,0.28)] tracking-[3px] uppercase mb-2.5">What You Walk Away With</div>
          {outcomes.map((item, i) => (
            <div key={i} className="text-[14px] leading-[1.5] mb-2 pl-5 relative text-[rgba(240,237,230,0.5)]">
              <span className="absolute left-0 top-0 font-bold text-xs" style={{ color: c.accent }}>→</span>
              {item}
            </div>
          ))}
        </div>
      )}
      {tools.length > 0 && (
        <div className="mt-auto pt-4 border-t border-[rgba(45,184,155,0.06)]">
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
