# CLAUDE.md — AXIOM

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
/lib (business logic layer)
        ↓
Supabase (PostgreSQL = source of truth)
        ↓
AI layer (optional, external, read-only)
```

---

# 🗄️ DATA RULE (NON-NEGOTIABLE)

Supabase is the **only source of truth**.

Everything financial must originate from:

* transactions
* accounts
* budgets
* goals

You must NEVER:

* invent financial state
* simulate balances without DB derivation
* duplicate financial truth in memory or frontend

---

# ⚙️ HOW YOU SHOULD WORK

## 1. THINK IN LAYERS

Before writing code, always identify:

* What is UI?
* What is business logic?
* What is database access?
* What is derived computation?

Do NOT mix layers.

---

## 2. NEVER SKIP THE DATA MODEL

Before implementing features involving money:

You must check:

* What tables are involved?
* What is the invariant?
* What is the source of truth?

If unclear → stop and clarify.

---

## 3. PREFER SMALL, PURE FUNCTIONS

Financial logic should be:

* deterministic
* testable
* predictable

Avoid:

* hidden state
* side effects in calculations
* deeply nested logic

---

## 4. SERVER ACTIONS ARE THE CONTROL PLANE

All mutations must go through:

* Next.js server actions OR
* /lib service functions

Never mutate Supabase directly from UI components.

---

## 5. SUPABASE SAFETY RULES

When interacting with Supabase:

* assume all client input is untrusted
* always enforce user ownership filters
* never bypass Row Level Security assumptions
* never expose service role keys in client code

---

# 💰 FINANCIAL LOGIC RULES

## 1. Transactions are immutable events

Do not edit transactions in place unless explicitly required.

Prefer:

* correction entries
* audit-friendly updates

---

## 2. Balances are derived

Account balances should be:

* computed from transactions OR
* carefully synchronized with strict invariants

Never allow silent drift.

---

## 3. Categories are labels, not truth

Categories can be:

* inferred
* corrected
* reclassified

They are not financial facts.

---

# 🤖 AI INTEGRATION RULES

(when AI features are used)

## 1. AI is read-only

AI must only:

* analyze data
* generate insights
* detect patterns
* explain behavior

AI must NEVER:

* write to database
* modify financial records
* generate authoritative financial state

---

## 2. AI input must be structured

Never pass raw frontend state to AI.

Only pass:

* validated DB queries
* aggregated financial summaries
* sanitized context objects

---

## 3. AI outputs are NOT truth

AI outputs are:

* probabilistic
* interpretive
* advisory

They must never be stored as financial records.

---

# 🧱 CODE ORGANIZATION RULES

## /lib/finance

* all financial calculations
* transaction logic
* budget logic

## /lib/db

* Supabase queries
* data access layer

## /lib/ai

* prompt building
* AI orchestration
* insight generation

## /app

* UI only
* no business logic

---

# 🚨 COMMON MISTAKES TO AVOID

* duplicating financial calculations in UI
* storing computed balances as truth
* mixing AI outputs with database state
* bypassing server logic layer
* overengineering early abstractions

---

# 🧭 DECISION PRINCIPLE

If unsure how to implement something:

1. Choose simplest correct solution
2. Prefer explicit logic over magic abstraction
3. Ensure traceability to Supabase data
4. Ask: “Can this be verified from transactions?”

If not → do not implement yet.

---

# 🧪 QUALITY BAR

Every change should satisfy:

* Is it consistent with DB truth?
* Can it be traced back to transactions?
* Does it preserve architectural boundaries?
* Would another engineer understand it without explanation?

If any answer is “no” → revise.

---

# FINAL NOTE

You are not building features.

You are building a **financial truth system with an intelligence layer on top**.

Treat every line of code as part of a long-lived financial system, not a prototype.
