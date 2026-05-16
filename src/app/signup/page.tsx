"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-foreground/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-12 group">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-foreground rounded-3xl rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110 shadow-2xl"></div>
            <div className="absolute inset-0 w-16 h-16 bg-foreground/20 rounded-3xl -rotate-6 scale-95 transition-transform group-hover:-rotate-12"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-background text-2xl">
              A
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-center">
            INITIALIZE <span className="text-gray-500">ACCESS</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 text-center">
            Deploy your personal intelligence layer
          </p>
        </div>

        <div className="bg-background/40 backdrop-blur-xl p-10 rounded-[2.5rem] border-2 border-foreground/5 shadow-2xl relative">
          <div className="absolute -top-3 left-10 px-4 py-1 bg-foreground text-background text-[8px] font-black uppercase tracking-widest rounded-full">
            New Protocol Initialization
          </div>

          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "var(--foreground)",
                    brandAccent: "var(--foreground)",
                    brandButtonText: "var(--background)",
                    defaultButtonBackground: "transparent",
                    defaultButtonBackgroundHover: "var(--foreground)",
                    defaultButtonText: "var(--foreground)",
                    defaultButtonBorder: "var(--foreground)",
                    inputText: "var(--foreground)",
                    inputBackground: "transparent",
                    inputBorder: "var(--input-border)",
                    inputPlaceholder: "var(--input-placeholder)",
                    inputLabelText: "var(--input-label)",
                  },
                  radii: {
                    buttonBorderRadius: "20px",
                    inputBorderRadius: "20px",
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: "Professional Email",
                  password_label: "Access Key",
                  button_label: "Begin Initialization",
                  link_text: "Already authorized? Access terminal",
                },
              },
            }}
            providers={["google"]}
            redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`}
          />

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Return to Authorization
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="h-[1px] w-12 bg-foreground/10"></div>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest leading-relaxed max-w-xs opacity-60">
            Initialization grants read-write access to the Axiom deterministic ledger. Secure your access key immediately after authorization.
          </p>
        </div>
      </div>
    </main>
  );
}
