# AGENTS.md — AXIOM v2

This document defines rules for AI coding agents operating inside the Axiom codebase.

Axiom is a financial intelligence system built on Next.js and Supabase.

---

# 🧭 SYSTEM OVERVIEW

Axiom follows **Architecture A**:

```text id="a0x1a"
Next.js (UI + Server Actions)
        ↓
Application Logic Layer (/lib)
        ↓
Supabase (PostgreSQL + Auth)
        ↓
AI Layer (external API - undecided)
```

---

# 🧠 CORE PHILOSOPHY

> The database is truth. Everything else is interpretation or computation.

Agents must operate under the assumption that:

* Supabase is the only source of financial truth
* all other layers are derived or representational

---

# 🗄️ SUPABASE RULES (CRITICAL)

## 1. SINGLE SOURCE OF TRUTH

Supabase contains all canonical financial data:

* users
* accounts
* transactions
* budgets
* goals
* categories

Agents must NEVER:

* duplicate financial state elsewhere
* treat frontend state as authoritative
* override DB values via computed logic

---

## 2. NO DIRECT AI WRITE ACCESS

AI systems (current or future) MUST NOT:

* insert transactions
* modify balances
* alter budgets directly
* fabricate financial records

AI is strictly:

> read → analyze → interpret → suggest

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

* rendering only
* no business logic
* no financial computation

### Application Logic (/lib)

* financial calculations
* validation
* transformations
* aggregation logic

### Database Layer (/lib/db)

* Supabase queries
* CRUD operations
* data access abstraction

### AI Layer (/lib/ai)

* prompts
* context building
* insight generation
* interpretation only

---

## 2. NO LOGIC DUPLICATION

If a rule exists in:

* finance calculations
* transaction handling
* budget logic

It must exist in ONE place only.

Duplication = architectural failure.

---

## 3. DERIVED DATA MUST BE TRACEABLE

All computed values must be traceable to:

* transactions
* accounts
* budgets

No “mystery numbers” allowed.

---

# 💰 FINANCIAL ENGINE RULES

## 1. TRANSACTIONS ARE IMMUTABLE EVENTS

A transaction:

* is never edited in-place (prefer correction entries)
* is always timestamped
* is always user-owned

---

## 2. BALANCES ARE DERIVED

Account balances must:

* be computed from transactions OR
* be carefully maintained with strict invariants

Never allow silent drift.

---

## 3. CATEGORIES ARE LABELS, NOT TRUTH

Categories:

* can be inferred
* can be corrected
* are not financial facts

---

# 🤖 AI INTEGRATION RULES

(when AI layer is introduced)

## 1. AI IS NOT A SYSTEM OF RECORD

AI cannot:

* define financial truth
* persist authoritative data
* overwrite DB state

---

## 2. AI IS AN INTERPRETER ONLY

AI outputs:

* insights
* explanations
* behavioral patterns
* suggestions

Not:

* stored financial facts
* system state
* computed balances

---

## 3. AI MUST USE STRUCTURED INPUT ONLY

All AI prompts must be built from:

* DB queries
* server-side aggregation
* sanitized context objects

Never raw frontend state.

---

# ⚙️ DEVELOPMENT RULES

## 1. KEEP THINGS SIMPLE FIRST

Prefer:

* clear functions
* explicit logic
* minimal abstraction

Avoid:

* premature microservices
* event-driven complexity
* over-engineered pipelines

---

## 2. EVERY FEATURE MUST ANSWER:

* What data does it read?
* What data does it modify?
* Which layer owns it?

If unclear → do not implement yet.

---

## 3. NO HIDDEN SIDE EFFECTS

All financial operations must be:

* explicit
* traceable
* predictable

---

## 4. FAIL LOUDLY, NOT SILENTLY

If something is wrong:

* throw errors
* block operations
* do not silently fallback

---

# 🔐 SECURITY RULES

* Never expose Supabase service role key in client code
* All sensitive DB operations must be server-side
* Validate user ownership before mutations
* Assume all client input is untrusted

---

# 📁 FILE OWNERSHIP MODEL

* `/lib/finance` → financial logic owner
* `/lib/db` → database access owner
* `/lib/ai` → AI orchestration owner
* `/app` → UI + routing only

Agents must NOT move logic across layers without reason.

---

# 🚨 COMMON FAILURE MODES TO AVOID

* duplicating transaction logic in UI
* calculating balances in multiple places
* letting AI write to DB
* mixing analytics with raw data
* bypassing Supabase RLS assumptions

---

# 🧭 FINAL RULE

If unsure:

> choose simplicity, correctness, and traceability over cleverness

Axiom is not a prototype of ideas.

It is a system of financial truth.
