# AGENTS.md — AI Workflow & Methodology

This document instructs future AI coding agents on the specific methodologies and UX patterns required to build within the Axiom system.

## 1. "Build Backwards" Methodology
When implementing new features or insights, work from the end of the pipeline toward the source to ensure architectural alignment:
1. **Insight Registry**: Define the interpretation rules and thresholds in `registry.ts` (Interpretation).
2. **Context Layer**: Define the signals and behavioral markers in `lib/context` (Signals).
3. **Analytics Engine**: Implement the deterministic math and logic in `lib/analytics` (Math).
4. **Database/UI**: Finally, implement the schema changes and the user interface.

This ensures that UI components are always backed by a rigorous, testable analytical foundation.

## 2. "The Quiet System" UI Philosophy
- **Forgiving Interfaces**: Assume user failure or data gaps. Build elastic interfaces that handle missing telemetry or "Quiet System" states without breaking.
- **Immediate Revalidation**: After any server-side mutation, call `revalidatePath` immediately to drop the cache and ensure the UI reflects "The Source" (Supabase).
- **No Optimistic UI for Totals**: While UI interactions can be snappy, critical financial totals (Net Worth, Runway, Burn) MUST NEVER use optimistic updates. They must only update after a successful round-trip to the server to maintain "Financial Certainty."

## 3. Core Workflow Priorities
- **Correctness over Speed**: Every financial calculation must be verified against the deterministic analytics engine.
- **Traceability**: Every figure in the UI must be traceable back to a raw value in Supabase.
- **Security**: Always verify RLS and auth boundaries before touching a single line of data-access code.
