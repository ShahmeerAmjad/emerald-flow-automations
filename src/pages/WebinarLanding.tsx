// src/pages/WebinarLanding.tsx — Webinar Registration Landing Page

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Calendar, Clock, Video, MessageCircle } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/* ═══ CONSTANTS ═══ */

const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/CYOvHM2nLLQ2vUnLZU18EH?mode=gi_t";

// Replace this with your deployed Google Apps Script URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNRHAy5x2dZQD1tKFOsxhn7SBwQbSioDbhlamjcwE8_OdajRenwzZJ7SMSrria4n9G/exec";

/* ═══ FORM SCHEMA ═══ */

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
});

type FormValues = z.infer<typeof formSchema>;

/* ═══ MAIN COMPONENT ═══ */

export default function WebinarLanding() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", whatsapp: "" },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          timestamp: new Date().toISOString(),
        }),
      });
      setIsSubmitted(true);
    } catch {
      // no-cors won't throw on success — if we get here something is really wrong
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
        <div className="absolute top-[1200px] -right-24 w-[500px] h-[500px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(45,184,155,0.06)_0%,transparent_70%)] animate-[orbFloat_26s_ease-in-out_infinite_-8s]" />
        <div className="absolute top-[2000px] -left-36 w-[600px] h-[600px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(71,236,204,0.04)_0%,transparent_70%)] animate-[orbFloat_24s_ease-in-out_infinite_-14s]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[680px] mx-auto px-4 sm:px-8 py-10 sm:py-14 md:py-[60px]">
        {isSubmitted ? (
          <ConfirmationView />
        ) : (
          <RegistrationView
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Footer */}
        <footer className="text-center pt-9 pb-6">
          <div className="text-[26px] font-bold tracking-[-0.5px] mb-2.5">
            <span className="text-[#2DB89B]">Sas</span>
            <span className="text-[#EDE8D0]">Solutions.ai</span>
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-xs text-[rgba(240,237,230,0.28)] tracking-[3px] uppercase">
            The future belongs to{" "}
            <span className="text-[#2DB89B]">those who build</span> — not those
            who watch
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
      `}</style>
    </div>
  );
}

/* ═══ REGISTRATION VIEW ═══ */

function RegistrationView({
  form,
  onSubmit,
  isSubmitting,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
}) {
  return (
    <>
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-3 px-5 sm:px-7 py-2.5 border border-[rgba(45,184,155,0.12)] bg-[rgba(45,184,155,0.07)] backdrop-blur-sm mb-7 sm:mb-9 animate-[fadeSlideUp_0.6s_cubic-bezier(0.22,1,0.36,1)_both,borderGlow_4s_ease-in-out_infinite]">
          <span className="w-2 h-2 bg-[#47ECCC] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#2DB89B]" />
          <span className="font-['JetBrains_Mono',monospace] text-[11px] sm:text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium">
            Free Live Webinar&ensp;&middot;&ensp;Every Sunday
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.98] tracking-[-2px] sm:tracking-[-3px] mb-2 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]">
          <span className="font-light text-[rgba(240,237,230,0.5)]">
            LEARN TO
          </span>{" "}
          <span className="bg-gradient-to-br from-[#2DB89B] via-[#47ECCC] to-[#2DB89B] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_6s_linear_infinite]">
            BUILD WITH AI
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-[22px] text-[rgba(240,237,230,0.5)] font-normal mt-5 sm:mt-6 leading-[1.65] max-w-[600px] mx-auto animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
          Join our{" "}
          <strong className="text-[rgba(240,237,230,0.9)] font-semibold">
            free weekly webinar
          </strong>{" "}
          where we break down AI tools, automation, and real-world skills you
          can start using{" "}
          <span className="text-[#47ECCC] font-semibold">immediately</span>.
        </p>
      </section>

      <Separator />

      {/* What You'll Learn */}
      <section className="animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.4s_both]">
        <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-6">
          What You'll Learn
        </div>
        {[
          "How to use ChatGPT, Claude, and other AI tools like a power user",
          "Automation workflows that save hours of manual work every week",
          "Real freelancing strategies to start earning with AI skills",
          "Live demos and Q&A — bring your questions, get real answers",
        ].map((item, i) => (
          <div
            key={i}
            className="text-[15px] sm:text-[17px] leading-[1.55] mb-3.5 pl-7 relative text-[rgba(240,237,230,0.7)]"
          >
            <span className="absolute left-0 top-0 font-bold text-base text-[#47ECCC]">
              ▸
            </span>
            {item}
          </div>
        ))}
      </section>

      <Separator />

      {/* Registration Form */}
      <section className="p-6 sm:p-8 border border-[rgba(45,184,155,0.12)] bg-gradient-to-br from-[rgba(45,184,155,0.07)] to-transparent relative overflow-hidden animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2DB89B] to-transparent" />

        <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-2">
          Reserve Your Spot
        </div>
        <p className="text-sm text-[rgba(240,237,230,0.4)] mb-6">
          Every Sunday at 3:00 PM PKT — completely free.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">
                    Full Name
                  </FormLabel>
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
                  <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">
                    Email Address
                  </FormLabel>
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

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[rgba(240,237,230,0.7)] text-sm font-medium">
                    WhatsApp Number
                  </FormLabel>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-br from-[#2DB89B] to-[#47ECCC] text-[#050907] font-['Sora',sans-serif] text-base sm:text-lg font-extrabold uppercase tracking-[3px] sm:tracking-[5px] py-4 sm:py-5 border-none cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(45,184,155,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(45,184,155,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Registering..." : "Register Now — It's Free"}
            </button>
          </form>
        </Form>
      </section>

      <Separator />

      {/* Urgency Box */}
      <section className="p-5 sm:p-6 border border-[rgba(45,184,155,0.1)] bg-[rgba(45,184,155,0.03)] text-center animate-[glowPulse_4s_ease-in-out_infinite]">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <span className="w-2.5 h-2.5 bg-[#47ECCC] rounded-full animate-[livePulse_1.5s_ease-in-out_infinite] shadow-[0_0_12px_#2DB89B]" />
          <span className="font-['JetBrains_Mono',monospace] text-sm sm:text-[15px] text-[#47ECCC] tracking-[3px] uppercase font-bold">
            Limited Spots Available
          </span>
        </div>
        <p className="text-sm sm:text-base text-[rgba(240,237,230,0.5)] leading-[1.7] max-w-[520px] mx-auto">
          We keep each session small so everyone gets personal attention and
          their questions answered.{" "}
          <strong className="text-[rgba(240,237,230,0.9)]">
            Register now to lock in your seat
          </strong>{" "}
          for this Sunday's session.
        </p>
      </section>
    </>
  );
}

/* ═══ CONFIRMATION VIEW ═══ */

function ConfirmationView() {
  return (
    <div className="text-center py-10 sm:py-16 animate-[fadeSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_both]">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(45,184,155,0.1)] border border-[rgba(45,184,155,0.2)] mb-8">
        <CheckCircle className="w-10 h-10 text-[#47ECCC]" />
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-2px] mb-4">
        You're{" "}
        <span className="bg-gradient-to-br from-[#2DB89B] via-[#47ECCC] to-[#2DB89B] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_6s_linear_infinite]">
          In!
        </span>
      </h2>

      <p className="text-base sm:text-lg text-[rgba(240,237,230,0.5)] leading-[1.65] max-w-[480px] mx-auto mb-10">
        Your spot is reserved. Here's what happens next — join the WhatsApp
        group to get the Zoom link and session reminders.
      </p>

      {/* Webinar Details Card */}
      <div className="p-6 sm:p-8 border border-[rgba(45,184,155,0.12)] bg-[#0C1210] text-left max-w-[440px] mx-auto mb-10">
        <div className="font-['JetBrains_Mono',monospace] text-[13px] tracking-[5px] uppercase text-[#2DB89B] font-medium mb-5">
          Webinar Details
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[rgba(240,237,230,0.7)]">
            <Calendar className="w-5 h-5 text-[#47ECCC] shrink-0" />
            <span className="text-[15px] sm:text-[17px]">
              Every Sunday
            </span>
          </div>
          <div className="flex items-center gap-3 text-[rgba(240,237,230,0.7)]">
            <Clock className="w-5 h-5 text-[#47ECCC] shrink-0" />
            <span className="text-[15px] sm:text-[17px]">
              3:00 PM PKT
            </span>
          </div>
          <div className="flex items-center gap-3 text-[rgba(240,237,230,0.7)]">
            <Video className="w-5 h-5 text-[#47ECCC] shrink-0" />
            <span className="text-[15px] sm:text-[17px]">
              Zoom — link shared via WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-gradient-to-br from-[#2DB89B] to-[#47ECCC] text-[#050907] font-['Sora',sans-serif] text-base sm:text-lg font-extrabold uppercase tracking-[3px] sm:tracking-[5px] px-10 sm:px-16 py-5 sm:py-6 border-none cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(45,184,155,0.15)] hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(45,184,155,0.3)] hover:tracking-[5px] sm:hover:tracking-[7px]"
      >
        <MessageCircle className="w-6 h-6" />
        Join WhatsApp Group
      </a>

      <p className="text-sm text-[rgba(240,237,230,0.3)] mt-6 max-w-[400px] mx-auto leading-[1.6]">
        This is where we share the Zoom link, session updates, and bonus
        resources. Don't miss it.
      </p>
    </div>
  );
}

/* ═══ SEPARATOR ═══ */

function Separator() {
  return (
    <div className="relative my-10 sm:my-14 h-px bg-gradient-to-r from-transparent via-[rgba(45,184,155,0.25)] to-transparent">
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2DB89B] rounded-full opacity-50" />
    </div>
  );
}
