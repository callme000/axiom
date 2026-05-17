# CLAUDE.md — AXIOM (Phase 5E)

This file defines how Claude (and similar coding agents) should behave when working inside the Axiom codebase.

Axiom is a financial intelligence system built with Next.js and Supabase.

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
/lib/analytics (deterministic engine)
        ↓
/lib/context (behavioral mapping)
        ↓
/lib/ai/kairos (rule-based interpretation)
        ↓
Supabase (PostgreSQL = source of truth)
```

---

# 🗄️ DATA RULE (NON-NEGOTIABLE)

Supabase is the **only source of truth**.

Everything financial must originate from:

* deployments (manual events)
* operational_baseline (structural flows)
* strategic_objectives (intentions)
* accounts & liabilities

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

## 3. PREFER DETERMINISTIC LOGIC

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

## 2. Operational Baseline defines structural burn

All recurring outflows (Rent, DCA) must live in the baseline.
Baseline burn is a mandatory input for runway calculations.

---

## 3. Runway is the Resilience Horizon

Runway must reflect the **Insolvent Stable** state.
If `Net Worth < 0`, Runway is `0` regardless of current cash flow.
*   **Visual State**: Use the structural constant `isInfiniteRunway` to track states where inbound replenishment absorbs current burn.

---

# 🤖 AI INTEGRATION RULES (KAIROS)

## 1. Kairos is an Interpreter, not a Generator

Kairos analyzes analytics truth against a **Rule Registry**.
If it cannot be traced to an analytics threshold, Kairos must not say it.

---

## 2. Actionable Signals

Signals in the UI must link to the section where the issue can be fixed.
Support signals with **Strategic Guidance** popups.

---

# 🧱 CODE ORGANIZATION RULES

## /lib/analytics

* deterministic financial engine
* goal & objective progress

## /lib/context

* behavioral trend mapping
* volatility & discipline analysis

## /lib/ai/kairos

* rule-based strategic interpretation
* high-priority triggers

## /app/dashboard

* UI only
* category-specific navigation

---

# 🚨 COMMON MISTAKES TO AVOID

* duplicating analytics in UI
* "starving" the AI layer of context
* bypass logic in the telemetry pipeline
* ignoring structural deficits in runway math

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
