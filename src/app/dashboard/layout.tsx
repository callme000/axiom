"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-background border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-lg"></div>
          <span className="text-xl font-bold tracking-tight uppercase">
            AXIOM
          </span>
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
