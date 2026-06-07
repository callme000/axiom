"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { checkOnboardingStatusAction } from "./actions";
import { BrandMark } from "@/components/ui/brand-mark";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      try {
        const { isOnboarded } = await checkOnboardingStatusAction();
        setIsOnboarded(isOnboarded);
      } catch {
        setIsOnboarded(false);
      }
    }
    init();

    const handleScroll = () => {
      const sections = ["overview", "deploy", "intelligence", "ledger"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const navItems = [
    { id: "overview", label: "Overview", roman: "I" },
    { id: "deploy", label: "Architecture", roman: "II" },
    { id: "intelligence", label: "Intelligence", roman: "III" },
    { id: "ledger", label: "Ledger", roman: "IV" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative selection:bg-white selection:text-black">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-white/2 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/2 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </div>

      {isOnboarded === true && (
        <>
          {/* SIDEBAR */}
          <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-80 bg-black border-r border-white/5 z-50 p-12 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-24">
                {/* Logo */}
                <Link href="/" className="group">
                  <div className="flex items-center gap-4">
                    <BrandMark />
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] tracking-[0.4em] uppercase font-bold text-white">
                        AXIOM
                      </span>
                      <span className="text-[7px] font-mono tracking-[0.2em] uppercase text-white/30">
                        Intelligence Layer
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Navigation */}
                <nav className="space-y-12">
                  <p className="text-[10px] font-mono tracking-[0.5em] text-white/20 uppercase mb-8">
                    Client Portal
                  </p>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full group text-left transition-all ${
                        activeSection === item.id
                          ? "opacity-100"
                          : "opacity-30 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <span className="font-cormorant italic text-2xl text-white/60">
                          {item.roman}.
                        </span>
                        <span
                          className={`font-cormorant text-2xl tracking-wide transition-all ${
                            activeSection === item.id
                              ? "translate-x-2"
                              : "group-hover:translate-x-2"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* User Profile */}
              <div className="pt-12 border-t border-white/5 relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-4 w-full group"
                >
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center font-mono text-xs text-white/60 group-hover:bg-white group-hover:text-black transition-all">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase truncate max-w-30">
                      {user?.email?.split("@")[0]}
                    </span>
                    <span className="text-[8px] font-mono tracking-widest text-white/20 uppercase">
                      Verified Session
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute bottom-full left-0 mb-4 w-full bg-black border border-white/10 p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left font-mono text-[9px] tracking-widest text-red-500 hover:text-red-400 uppercase py-2"
                    >
                      Terminate Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* MOBILE HEADER */}
          <header className="md:hidden sticky top-0 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 px-6 py-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BrandMark className="w-8 h-8" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">
                Axiom // Portal
              </span>
            </div>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="w-8 h-8 border border-white/10 flex items-center justify-center font-mono text-[10px]">
                {user?.email?.[0].toUpperCase()}
              </div>
            </button>
          </header>
        </>
      )}

      {/* MAIN CONTENT AREA */}
      <main
        className={`flex-1 min-h-screen relative z-10 transition-all duration-1000 ${isOnboarded === true ? "md:ml-80" : "md:ml-0"}`}
      >
        <SmoothScrollProvider>
          <div
            className={`max-w-5xl mx-auto px-6 md:px-16 py-12 md:py-24 ${isOnboarded === false ? "h-full flex items-center justify-center" : ""}`}
          >
            {children}
          </div>
        </SmoothScrollProvider>
      </main>

      {/* MOBILE BOTTOM NAV */}
      {isOnboarded === true && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 z-50 px-6 py-4 flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-mono text-[8px] tracking-widest uppercase transition-all ${
                activeSection === item.id ? "text-white" : "text-white/20"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
