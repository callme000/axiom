"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    // Listen for auth changes
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-12 group">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-foreground rounded-3xl rotate-6 transition-transform group-hover:rotate-12 group-hover:scale-110"></div>
            <div className="absolute inset-0 w-16 h-16 bg-foreground/20 rounded-3xl -rotate-12 scale-95 transition-transform group-hover:-rotate-18"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-background text-2xl">
              A
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase">
            AXIOM
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
            Intelligence Layer / Financial Truth
          </p>
        </div>

        <div className="bg-background/40 backdrop-blur-xl p-10 rounded-[2.5rem] border-2 border-foreground/5 shadow-2xl">
          <Auth
            supabaseClient={supabase}
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
                  },
                  radii: {
                    buttonBorderRadius: "20px",
                    inputBorderRadius: "20px",
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="h-[1px] w-12 bg-foreground/10"></div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
            Authorized Personnel Only
            <br />
            Secure Encrypted Session
          </p>
        </div>
      </div>
    </main>
  );
}
