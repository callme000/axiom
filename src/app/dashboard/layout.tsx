"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    const handleScroll = () => {
      const sections = ["overview", "deploy", "intelligence", "ledger"];
      const scrollPosition = window.scrollY + 100;

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

  const userInitial = user?.email?.[0].toUpperCase() || "U";

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "deploy",
      label: "Deploy",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: "intelligence",
      label: "Intelligence",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      id: "ledger",
      label: "Ledger",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false);
    }
  };

  const activeLabel = navItems.find((item) => item.id === activeSection)?.label;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* MOBILE HEADER */}
      <header className="md:hidden h-16 border-b border-foreground/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground rounded-lg flex items-center justify-center">
            <span className="font-black text-background text-[8px]">A</span>
          </div>
          <span className="text-xs font-black uppercase tracking-widest">
            {activeLabel}
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-foreground/60"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </header>

      {/* SIDEBAR OVERLAY (MOBILE) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${
          isSidebarCollapsed ? "md:w-20" : "md:w-64"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} border-r border-foreground/5 bg-background flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out`}
      >
        {/* BRANDING */}
        <div className={`p-8 ${isSidebarCollapsed ? "px-4" : "pb-12"}`}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative shrink-0">
              <div className="w-8 h-8 bg-foreground rounded-xl rotate-3 transition-transform group-hover:rotate-12 group-hover:scale-110"></div>
              <div className="absolute inset-0 w-8 h-8 bg-foreground/20 rounded-xl -rotate-6 scale-95 transition-transform group-hover:-rotate-12"></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-background text-[10px]">
                A
              </div>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-lg font-black tracking-tighter uppercase leading-none">
                  AXIOM
                </span>
                <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest mt-1">
                  Intelligence Layer
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1">
          {!isSidebarCollapsed && (
            <p className="px-4 text-[9px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-4 animate-in fade-in duration-300">
              Financial Terminal
            </p>
          )}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-4 px-4"} py-3 rounded-2xl transition-all duration-300 group ${
                activeSection === item.id
                  ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                  : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <span
                className={`transition-transform duration-300 ${activeSection === item.id ? "scale-110" : "group-hover:scale-110"}`}
              >
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
              {activeSection === item.id && !isSidebarCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 bg-background rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        {/* COLLAPSE TOGGLE (DESKTOP) */}
        <div className="hidden md:block px-4 mb-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-3 rounded-2xl text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={`transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* USER PROFILE (BOTTOM) */}
        <div className="p-4 mt-auto border-t border-foreground/5">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3 p-3"} rounded-2xl hover:bg-foreground/5 transition-all group text-left`}
            >
              <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-foreground/10 transition-all overflow-hidden shrink-0">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-black text-foreground/40 group-hover:text-foreground transition-colors text-xs">
                    {userInitial}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <>
                  <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                    <p className="text-[10px] font-black text-foreground truncate">
                      {user?.email?.split("@")[0]}
                    </p>
                    <p className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest">
                      Verified
                    </p>
                  </div>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className={`ml-auto transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </>
              )}
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                <div
                  className={`absolute ${isSidebarCollapsed ? "left-full bottom-0 ml-2" : "bottom-full left-0 mb-2"} w-48 md:w-full bg-background border border-foreground/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  <div className="p-4 border-b border-foreground/5">
                    <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mb-1">
                      Session Details
                    </p>
                    <p className="text-[10px] font-bold text-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      disabled
                      className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-foreground/40 cursor-not-allowed flex items-center justify-between"
                    >
                      Settings
                      <span className="text-[7px] bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/30">
                        Soon
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* DESKTOP STICKY HEADER FOR SECTION TITLE */}
        <header className="hidden md:flex h-20 sticky top-0 bg-background/50 backdrop-blur-xl z-30 items-center px-12 border-b border-foreground/5">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black uppercase tracking-tighter">
              {activeLabel}
            </h1>
            <div className="h-4 w-[1px] bg-foreground/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">
                Real-time Intelligence Active
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 md:py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
