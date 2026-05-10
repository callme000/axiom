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
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-foreground rounded-2xl mb-4"></div>
          <h1 className="text-5xl font-black tracking-tighter">AXIOM</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Intelligence / Finance
          </p>
        </div>

        <div className="bg-background p-8 rounded-3xl border shadow-sm">
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
                  },
                  radii: {
                    buttonBorderRadius: "12px",
                    inputBorderRadius: "12px",
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>

        <p className="text-center text-gray-400 text-[10px] mt-8 font-medium uppercase tracking-widest">
          Secure Financial Truth System
        </p>
      </div>
    </main>
  );
}
