"use client";

import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function handleLogout() {
    await supabase.auth.signOut();
    // Refresh to trigger middleware redirection
    window.location.href = "/";
  }

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

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 hover:text-foreground transition"
        >
          Logout
        </button>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
