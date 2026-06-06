"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function SignUp() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-black text-white relative overflow-hidden selection:bg-white selection:text-black">
      {/* Left Side: Editorial Canvas - Tactical Intelligence */}
      <div className="hidden md:flex md:w-1/2 bg-[#020202] relative items-center justify-center border-r border-white/5 overflow-hidden">
        {/* The Tactical Schematic Image */}
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-110 grayscale"
          style={{
            backgroundImage: "url('/images/tactical-schematic.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Depth & Focus Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-white/[0.01] rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
        </div>

        <div className="relative z-10 max-w-lg px-12 text-center">
          <ScrollReveal direction="up">
            <h2 className="font-cormorant italic text-5xl lg:text-7xl text-white mb-8 leading-tight">
              Strategic Wealth <br />
              <span className="not-italic font-medium text-white/80">
                Architecture.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="h-[1px] w-12 bg-white/20 mx-auto mb-8" />
            <p className="text-white/40 font-mono text-[9px] tracking-[0.6em] uppercase">
              Axiom Strategic Protocol // v1.0
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Right Side: Authentication Portal */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 relative z-10 bg-black">
        <div className="w-full max-w-md">
          {/* Brand & Header */}
          <div className="flex flex-col items-center mb-16">
            <ScrollReveal direction="down" delay={0.3}>
              <Link href="/" className="mb-12 block">
                <BrandMark className="w-14 h-14" />
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <h1 className="font-cormorant text-4xl text-white text-center mb-3 tracking-wide">
                Initialize Access
              </h1>
              <p className="text-white/30 text-[10px] font-mono text-center tracking-[0.3em] uppercase">
                Enter Sovereign Credentials
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="up" delay={0.5}>
            <div className="bg-white/[0.02] border border-white/5 p-10 md:p-14 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
              {/* Subtle Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <Auth
                supabaseClient={supabase}
                view="sign_up"
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "white",
                        brandAccent: "white",
                        brandButtonText: "black",
                        defaultButtonBackground: "transparent",
                        defaultButtonBackgroundHover: "rgba(255,255,255,0.05)",
                        defaultButtonText: "white",
                        defaultButtonBorder: "rgba(255,255,255,0.1)",
                        inputText: "white",
                        inputBackground: "transparent",
                        inputBorder: "rgba(255,255,255,0.1)",
                        inputPlaceholder: "rgba(255,255,255,0.2)",
                        inputLabelText: "rgba(255,255,255,0.4)",
                      },
                      radii: {
                        buttonBorderRadius: "9999px",
                        inputBorderRadius: "12px",
                      },
                      fonts: {
                        bodyFontFamily: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`,
                        buttonFontFamily: `var(--font-geist-mono), ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`,
                        inputFontFamily: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`,
                        labelFontFamily: `var(--font-geist-mono), ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`,
                      },
                    },
                  },
                  className: {
                    button:
                      "font-mono uppercase tracking-widest text-[10px] py-4 transition-all hover:scale-[1.02] active:scale-[0.98]",
                    label:
                      "font-mono uppercase tracking-widest text-[8px] mb-3 ml-1",
                    input:
                      "border-white/10 focus:border-white/40 transition-colors bg-white/5 py-3 px-4",
                  },
                }}
                localization={{
                  variables: {
                    sign_up: {
                      email_label: "EMAIL ADDRESS",
                      password_label: "SECURE ACCESS KEY",
                      button_label: "INITIALIZE PROTOCOL",
                      link_text: "AUTHORIZED? ACCESS PORTAL",
                    },
                    sign_in: {
                      email_label: "EMAIL ADDRESS",
                      password_label: "SECURE ACCESS KEY",
                      button_label: "AUTHORIZE SESSION",
                      link_text: "NO ACCESS? INITIALIZE LEDGER",
                    },
                  },
                }}
                providers={["google"]}
                redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`}
              />

              <div className="mt-12 text-center pt-10 border-t border-white/5">
                <Link
                  href="/"
                  className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] hover:text-white transition-colors"
                >
                  ← Return to Authorization
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.7}>
            <p className="mt-12 text-white/10 text-[8px] font-mono text-center uppercase tracking-[0.5em] leading-relaxed">
              All sessions are encrypted. Authorization granted by <br />
              Axiom Strategic Wealth Intelligence.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
