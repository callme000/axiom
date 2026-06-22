"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AuthCodeError() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-foreground p-6 font-mono selection:bg-white selection:text-black">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-red-500/20 p-8 md:p-12 shadow-2xl relative">
        {/* Warning Indicator */}
        <div className="flex items-center gap-4 border-b border-red-500/20 pb-6 mb-6">
          <ShieldAlert className="text-red-500 shrink-0" size={24} />
          <div>
            <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-red-500">
              AUTHENTICATION_FAILED // HANDSHAKE_FAULT
            </h1>
            <p className="text-[9px] tracking-widest text-zinc-500 uppercase">
              Secure protocol signature mismatch
            </p>
          </div>
        </div>

        <p className="text-zinc-400 text-xs leading-relaxed mb-8 uppercase tracking-wide">
          The cryptographic handshake with the security provider was interrupted. 
          The transaction token signature could not be verified by the OAuth controller.
        </p>

        {/* Diagnostic Stack Dump */}
        <div className="bg-black border border-white/5 p-4 mb-8 text-left">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
            Protocol Error Log
          </p>
          <p className="text-[10px] font-mono text-red-400 break-all leading-tight">
            SECURE_TOKEN_EXPIRED_OR_SIGNATURE_MISMATCH_EXCEPTION
          </p>
        </div>

        {/* Action Button - Hard Edge */}
        <Link
          href="/"
          className="w-full border border-white/10 bg-zinc-900 text-white hover:bg-white hover:text-black px-6 py-4 font-bold text-[10px] tracking-[0.4em] transition-all uppercase rounded-none block text-center"
        >
          [ RETURN_TO_AUTHORIZATION ]
        </Link>
      </div>
    </main>
  );
}
