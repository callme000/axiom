# AGENTS.md — AXIOM v3 (Phase 5E)

This document defines rules for AI coding agents operating inside the Axiom codebase.

Axiom is a financial intelligence system built on Next.js and Supabase.

---

# 🧭 SYSTEM OVERVIEW

Axiom follows **Architecture A**:

```text id="a0x1a"
Next.js (UI + Server Actions)
        ↓
Application Logic Layer (/lib/analytics)
        ↓
Behavioral Context Layer (/lib/context)
        ↓
AI Interpretation Layer (/lib/ai/kairos)
        ↓
Supabase (PostgreSQL + Auth)
```

---

# 🧠 CORE PHILOSOPHY

> The database is truth. Analytics compute state. AI interprets intent.

Agents must operate under the assumption that:

* Supabase is the only source of financial truth.
* Analytics are deterministic and traceable.
* Kairos is a restrained interpreter, not a conversational agent.

---

# 🗄️ SUPABASE RULES (CRITICAL)

## 1. SINGLE SOURCE OF TRUTH

Supabase contains all canonical financial data:

* users
* accounts
* deployments (Manual Capital Events)
* operational_baseline (Recurring Capital Flows)
* strategic_objectives (Directional Intentions)
* user_settings

Agents must NEVER:

* duplicate financial state elsewhere
* treat frontend state as authoritative
* override DB values via computed logic

---

## 2. NO DIRECT AI WRITE ACCESS

AI systems (Kairos) MUST NOT:

* insert transactions
* modify balances
* alter objectives directly
* fabricate financial records

AI is strictly:

> data → analytics → behavioral context → interpretation

---

## 3. ROW LEVEL SECURITY IS MANDATORY

All Supabase tables must enforce:

* user isolation
* no cross-user queries
* authenticated access only

If RLS is missing, it is a blocking issue.

---

## 4. SERVER IS THE GATEKEEPER

All sensitive operations must go through:

* Next.js Server Actions OR
* backend service layer (/lib/db or /lib/finance)

The frontend must NEVER:

* directly manipulate financial logic
* compute authoritative balances
* bypass validation rules

---

# 🧱 ARCHITECTURE RULES

## 1. STRICT LAYER SEPARATION

### UI Layer (/app, /components)

* rendering and user interaction
* actionable signals (links to corrective sections)
* no business logic

### Application Logic (/lib/analytics)

* deterministic financial engine
* runway and burn calculations
* alignment pressure scoring

### Behavioral Context (/lib/context)

* aggregation of analytics into behavioral metrics
* trend analysis (volatility, discipline)

### Database Layer (/lib/db)

* Supabase queries and CRUD
* data access abstraction

### AI Interpretation Layer (/lib/ai/kairos)

* rule-based strategic interpretation
* high-priority trigger evaluation
* **NO Generative AI** in core loop

---

## 2. DATA PIPELINE INTEGRITY (ZERO STARVATION)

All evaluation paths (UI + AI) must consume the **authoritative telemetry state**.
Avoid redundant DB roundtrips by streaming context from Server Actions directly to the interpretation layer.

---

# 💰 FINANCIAL ENGINE RULES

## 1. DEPLOYMENTS ARE IMMUTABLE

A deployment:

* is a manual capital event
* is always classified by taxonomy (Asset, Skill, Leverage, Experience, Maintenance, Leakage)

---

## 2. OPERATIONAL BASELINE IS STRUCTURAL

The baseline:

* defines recurring structural outflows (Rent, Subscriptions)
* defines systemic allocations (Automated Investments)
* is required for accurate runway/burn truth

---

## 3. RUNWAY (RESILIENCE HORIZON) IS DETERMINISTIC

Runway = `Pool / (Deployment Burn + Structural Burn - Income Replenishment)`

If `Net Worth < 0`, Runway is forced to `0` (Insolvent) to ensure UI honesty.

---

# 🤖 AI INTEGRATION RULES (KAIROS)

## 1. KAIROS IS DETERMINISTIC

Kairos follows a rule-based registry (`/lib/insights/rules/registry.ts`).
Every signal must be traceable to a specific analytics threshold.

---

## 2. THE PHILOSOPHY OF SILENCE

If no material structural deterioration exists, Kairos must remain silent.
*"Silence is intentional"* is a valid and preferred system state.

---

## 3. SEVERITY CALIBRATION

Signals must follow calibrated severity levels:

* **Observation**: Normal stable state.
* **Advisory**: Minor behavioral drift (e.g., Starvation).
* **Warning**: Alignment pressure or moderate shortfall.
* **Critical**: Solvency crisis, runway depletion, or negative net worth.

---

# 🧭 FINAL RULE

If unsure:

> choose simplicity, correctness, and traceability over cleverness

Axiom is not a prototype of ideas.

It is a system of financial truth.
