# CLAUDE.md — AXIOM (Phase 5E)

This file defines how Claude (and similar coding agents) should behave when working inside the Axiom codebase.

Axiom is a financial intelligence system built with Next.js and Supabase.

---

# 💎 BRAND STRATEGY & VOCABULARY

Axiom uses a premium, minimalist brand identity focused on **"Financial Certainty."**
When writing UI copy, dashboard components, or user-facing text, you MUST use the market-facing vocabulary:

| Internal/Technical Term | Market-Facing Name |
| :--- | :--- |
| Attestation / DB Sync | **The Source** |
| Deterministic Metrics | **Hard Figures** |
| Hydration / Data Sync | **The Pulse** |
| Baseline (`operational_baseline`) | **The Foundation** |
| Liabilities | **Commitments** |
| Account List | **The Ledger** |
| Income & Liabilities | **Inflows & Commitments** |
| Runway | **The Horizon** |
| Kairos AI / Advisory | **Kairos Intelligence** |
| Unverified / Pending / Confirmed | **Staged / Processing / Verified** |
| Suggestions / Advice | **Insights / Synthesis** |

*Tone:* Low-frequency, high-resolution, authoritative. "The math of wealth." No buzzwords.

---

# 🧠 CORE MISSION

Your job is to build a **correct, consistent, and maintainable financial system**, not to optimize for speed of implementation or clever solutions.

Always prioritize:

* correctness over speed
* clarity over abstraction
* consistency over creativity
* traceability over convenience

---

# 🏗️ SYSTEM CONTEXT

Axiom architecture:

```text id="axm1"
Next.js (UI + Server Actions)
        ↓
/lib/analytics (Hard Figures engine)
        ↓
/lib/context (behavioral mapping)
        ↓
/lib/ai/kairos (Kairos Intelligence interpretation)
        ↓
Supabase (PostgreSQL = The Source)
```

---

# 🗄️ DATA RULE (NON-NEGOTIABLE)

Supabase is **The Source** of truth.

Everything financial must originate from:

* deployments (manual events)
* operational_baseline (The Foundation: structural flows)
* strategic_objectives (intentions)
* accounts & liabilities (The Ledger & Commitments)

You must NEVER:

* invent financial state
* simulate balances without DB derivation
* duplicate financial truth in memory or frontend

---

# ⚙️ HOW YOU SHOULD WORK

## 1. THINK IN LAYERS

Before writing code, always identify:

* What is UI?
* What is analytics?
* What is behavioral context?
* What is interpretation?

Do NOT mix layers.

---

## 2. DATA PIPELINE INTEGRITY

Ensure all evaluation paths use the **Unified Telemetry Configuration**.
Stream authoritative context from Server Actions to the AI layer to prevent "starved" summaries.
*   **Conditional Evaluation Rule**: Passive lookups must default to `previousInsight` cache to preserve execution speed. Mutations must pass `{ forceInsightEvaluation: true }` to trigger fresh interpretation.

---

## 3. PREFER HARD FIGURES (DETERMINISTIC LOGIC)

Financial interpretation must be:

* threshold-based
* explainable
* predictable

Avoid:

* hidden state
* Generative AI for core financial assessments
* deeply nested logic

---

## 4. SERVER ACTIONS ARE THE CONTROL PLANE

All mutations must go through:

* Next.js server actions OR
* /lib service functions

Never mutate Supabase directly from UI components.

---

# 💰 FINANCIAL LOGIC RULES

## 1. Deployments are immutable capital events

Classify every deployment using the **Axiom Taxonomy**:
Asset, Skill, Leverage, Experience, Maintenance, Leakage.

---

## 2. The Foundation defines structural burn

All recurring outflows (Rent, DCA) must live in the baseline (`operational_baseline`).
Foundation burn is a mandatory input for horizon (runway) calculations.

---

## 3. The Horizon (Runway)

The Horizon must reflect the **Insolvent Stable** state.
If `Net Worth < 0`, The Horizon is `0` regardless of current cash flow.
*   **Visual State**: Use the structural constant `isInfiniteRunway` to track states where inbound replenishment absorbs current burn.

---

# 🤖 AI INTEGRATION RULES (KAIROS INTELLIGENCE)

## 1. Kairos Intelligence is an Interpreter, not a Generator

Kairos analyzes analytics truth against a **Rule Registry**.
If it cannot be traced to an analytics threshold, Kairos must not synthesize it.

---

## 2. Actionable Signals

Signals in the UI must link to the section where the issue can be fixed.
Support signals with **Insights & Synthesis** popups.

---

# 🧱 CODE ORGANIZATION RULES

## /lib/analytics

* deterministic Hard Figures engine
* goal & objective progress

## /lib/context

* behavioral trend mapping
* volatility & discipline analysis

## /lib/ai/kairos

* rule-based strategic interpretation (Kairos Intelligence)
* high-priority triggers

## /app/dashboard

* UI only
* category-specific navigation

---

# 🚨 COMMON MISTAKES TO AVOID

* duplicating analytics in UI
* "starving" the Kairos Intelligence layer of context
* bypass logic in the telemetry pipeline
* ignoring structural deficits in horizon math

---

# 🧭 DECISION PRINCIPLE

If unsure how to implement something:

1. Choose simplest correct solution
2. Prefer explicit logic over magic abstraction
3. Ensure traceability to Supabase data
4. Ask: “Can this be verified from the analytics engine?”

---

# FINAL NOTE

You are not building features.

You are building a **financial truth system with an intelligence layer on top**.

Treat every line of code as part of a long-lived financial system, not a prototype.