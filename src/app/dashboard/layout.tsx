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

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    // Refresh to trigger middleware redirection
    window.location.href = "/";
  }

  const userInitial = user?.email?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-background/80 backdrop-blur-md border-b border-foreground/5 px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="relative">
            <div className="w-10 h-10 bg-foreground rounded-2xl rotate-3 transition-transform group-hover:rotate-12 group-hover:scale-110"></div>
            <div className="absolute inset-0 w-10 h-10 bg-foreground/20 rounded-2xl -rotate-6 scale-95 transition-transform group-hover:-rotate-12"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-background text-xs">
              A
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">
              AXIOM
            </span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">
              Intelligence Layer
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-foreground/10 transition-all group overflow-hidden"
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-black text-foreground/40 group-hover:text-foreground transition-colors">
                {userInitial}
              </span>
            )}
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileOpen(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-56 bg-background border border-foreground/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-foreground/5">
                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1">
                    Authenticated As
                  </p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    disabled
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-foreground/40 cursor-not-allowed flex items-center justify-between"
                  >
                    Account Settings
                    <span className="text-[8px] bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/30">
                      Soon
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-colors"
                  >
                    Terminate Session
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
