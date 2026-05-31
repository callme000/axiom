"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

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

  const handlePasskeyAuth = async () => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPasskey();
      if (error) {
        if (
          error.message.includes("not found") ||
          error.message.includes("failed")
        ) {
          setAuthError(
            "BIOMETRIC HANDSHAKE FAILED. FALLBACK TO MANUAL DECRYPTION KEY REQUIRED.",
          );
        } else {
          setAuthError(`SYSTEM ERROR: ${error.message.toUpperCase()}`);
        }
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setAuthError("CRITICAL BIOMETRIC FAILURE. INITIALIZE MANUAL OVERRIDE.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-12 group">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-white rounded-none rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.1)]"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-black text-2xl">
              A
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-center">
            INITIALIZE <span className="text-white/40">ACCESS</span>
          </h1>
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.4em] mt-3 text-center">
            Deploy your personal intelligence layer
          </p>
        </div>

        <div className="bg-black border border-white/10 p-10 rounded-none shadow-2xl relative">
          <div className="absolute -top-3 left-10 px-4 py-1 bg-white text-black text-[8px] font-mono font-black uppercase tracking-widest">
            New Protocol Initialization
          </div>

          <div className="mb-8">
            <button
              onClick={handlePasskeyAuth}
              className="w-full py-4 bg-white text-black font-mono font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all border border-white active:scale-[0.98] cursor-pointer"
            >
              AUTHENTICATE VIA BIOMETRICS (PASSKEY)
            </button>
            {authError && (
              <div className="mt-4 font-mono text-[9px] text-white/60 uppercase tracking-tighter border-l border-white/20 pl-3 py-1">
                <span className="text-white/40 mr-2">{">"}</span> {authError}
              </div>
            )}
          </div>

          <div className="relative mb-8 flex items-center">
            <div className="flex-grow h-[1px] bg-white/10"></div>
            <span className="px-4 font-mono text-[8px] text-white/20 uppercase tracking-widest whitespace-nowrap">
              OR MANUAL DECRYPTION
            </span>
            <div className="flex-grow h-[1px] bg-white/10"></div>
          </div>

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
                    defaultButtonBackgroundHover: "#111111",
                    defaultButtonText: "white",
                    defaultButtonBorder: "#333333",
                    inputText: "white",
                    inputBackground: "transparent",
                    inputBorder: "#333333",
                    inputPlaceholder: "#555555",
                    inputLabelText: "#888888",
                  },
                  radii: {
                    buttonBorderRadius: "0px",
                    inputBorderRadius: "0px",
                  },
                  fonts: {
                    bodyFontFamily: `var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif`,
                    buttonFontFamily: `var(--font-geist-mono), ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`,
                    inputFontFamily: `var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif`,
                    labelFontFamily: `var(--font-geist-mono), ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`,
                  },
                },
              },
              className: {
                button: "font-mono uppercase tracking-widest text-xs",
                label: "font-mono uppercase tracking-tighter text-[10px]",
                input: "border-white/20 focus:border-white transition-colors",
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: "Professional Identifier",
                  password_label: "Encryption Key",
                  button_label: "Initialize Ledger Access",
                  link_text: "Authorized? Access Terminal",
                },
                sign_in: {
                  email_label: "Professional Identifier",
                  password_label: "Encryption Key",
                  button_label: "Authorize Session",
                  link_text: "No Access? Initialize Ledger",
                },
                forgotten_password: {
                  link_text: "Recover Encryption Key?",
                },
              },
            }}
            providers={["google"]}
            redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`}
          />

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[10px] font-mono text-white/40 uppercase tracking-widest hover:text-white transition-colors"
            >
              Return to Authorization
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="h-[1px] w-12 bg-white/10"></div>
          <p className="text-white/20 text-[9px] font-mono uppercase tracking-widest leading-relaxed max-w-xs">
            Initialization grants read-write access to the Axiom deterministic
            ledger. Secure your access key immediately after authorization.
          </p>
        </div>
      </div>
    </main>
  );
}
