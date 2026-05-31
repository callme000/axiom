import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* SECTION 1: THE HERO (The Hook) */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="space-y-8 relative z-10">
          <div className="inline-block border border-white/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 mb-4">
            Axiom Intelligence Layer // v1.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] lg:text-[10rem]">
            Stop tracking <br />
            your expenses. <br />
            It is keeping <br />
            you broke.
          </h1>
          <p className="max-w-2xl text-xl md:text-2xl text-white/60 leading-relaxed font-light">
            Traditional finance relies on passive tracking. Axiom is a
            deterministic engine that forces every shilling into a strict
            return-based taxonomy. Take control of your liquidity.
          </p>
          <div className="pt-8">
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-12 py-6 text-sm font-black uppercase tracking-widest hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Initialize Day Zero
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (The Pain) */}
      <section className="py-32 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 sticky top-32">
            01 // The Systemic Failure
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">
              Inflation is silent theft. Cash is a depreciating liability.
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              If you are leaving your liquidity in an M-Pesa account or a
              zero-interest checking account, you are losing purchasing power
              daily. The Kenyan ecosystem demands strategic deployment, not
              passive saving.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PHILOSOPHY (The Pivot) */}
      <section className="py-32 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/10 bg-white/5">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 sticky top-32">
            02 // The Five Taxonomy Gates
          </div>
          <div className="space-y-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">
              Axiom rejects passive spending.
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Every outbound transaction must be classified: Is it an Asset, a
              Skill, Leverage, Experience, or Leakage?
            </p>
            <div className="grid grid-cols-1 gap-4 font-mono text-sm">
              {[
                { label: "ASSET", desc: "Capital that generates yield." },
                {
                  label: "SKILL",
                  desc: "Investment in human capital / earning power.",
                },
                {
                  label: "LEVERAGE",
                  desc: "Tools that multiply output per hour.",
                },
                { label: "EXPERIENCE", desc: "High-value memory equity." },
                { label: "LEAKAGE", desc: "Unstructured wealth destruction." },
              ].map((gate) => (
                <div
                  key={gate.label}
                  className="border border-white/10 p-6 flex justify-between items-center group hover:bg-white hover:text-black transition-all cursor-default"
                >
                  <span className="font-black tracking-widest">
                    {gate.label}
                  </span>
                  <span className="text-[10px] opacity-40 group-hover:opacity-100 transition-opacity uppercase text-right ml-4">
                    {gate.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE ENGINE (The Proof) */}
      <section className="py-32 px-6 md:px-24 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 sticky top-32">
            03 // Kairos Intelligence
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">
              Meet Kairos.
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Your deterministic, sandboxed financial analyst. No
              hallucinations. Just clinical, mathematical truth about your
              structural solvency and income concentration.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="py-64 px-6 md:px-24 text-center border-t border-white/10 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">
            Ready to deploy <br />
            your capital?
          </h2>
          <div className="flex flex-col items-center gap-8">
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-16 py-8 text-sm font-black uppercase tracking-widest hover:bg-white/90 transition-all hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            >
              Establish Your Baseline
            </Link>
            <div className="h-24 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
            <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20">
              Axiom // Strategic Solvency Protocol
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-24 border-t border-white/5 text-[10px] font-mono text-white/20 uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-8">
        <div>© 2026 Axiom Labs // All Rights Reserved</div>
        <div className="flex gap-8">
          <span>Encrypted Session</span>
          <span>Kenya Ecosystem Optimized</span>
        </div>
      </footer>
    </main>
  );
}
