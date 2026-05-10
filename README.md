# AXIOM

Axiom is an AI-powered financial intelligence system that helps users understand, track, and improve their financial behavior through structured data analysis and AI-generated insights.

It is built around a strict separation between:

* financial truth (database)
* computed analytics (backend logic)
* AI interpretation (insights layer)

---

# 🧠 CORE PRINCIPLE

> Transactions are truth. Everything else is interpretation.

The system is designed so that:

* financial data is deterministic
* analytics are derived
* AI never becomes a source of truth

---

# 🏗️ ARCHITECTURE DECISION

Axiom follows **Architecture A**:

```
Next.js (Frontend + Server Actions)
        ↓
Backend Logic Layer (services / lib)
        ↓
Supabase (PostgreSQL + Auth)
        ↓
AI Layer (external API - undecided)
```

### Why this architecture:

* Keeps control of business logic inside the application layer
* Prevents database logic leakage into the frontend
* Allows swapping AI providers without rewriting core system
* Maintains a single source of truth in Supabase

---

# 🗄️ DATABASE (SUPABASE)

Axiom uses **Supabase** as its backend infrastructure:

* PostgreSQL database (source of truth)
* Authentication (Supabase Auth or future custom layer)
* Row Level Security (RLS) for user isolation

### Core data entities:

* Users
* Accounts
* Transactions
* Categories
* Budgets
* Goals

All financial computations derive from these entities.

---

# 🤖 AI LAYER (UNDECIDED)

The AI provider has NOT been selected yet.

Planned role of AI:

* interpret financial behavior
* generate insights and patterns
* explain spending habits
* assist goal tracking
* provide strategic financial guidance

### Key constraint:

AI is READ-ONLY over financial truth.

It can:

* analyze
* explain
* suggest

It cannot:

* modify financial records
* fabricate data
* override database truth

---

# 📁 PROJECT STRUCTURE

```
/app                → Next.js routes (UI + server actions)
/components        → UI components
/lib
  /finance         → financial logic (transactions, budgets, calculations)
  /ai              → AI orchestration layer (prompts, context building)
  /db              → Supabase client + data access layer
  /analytics       → derived metrics & insights

/prisma (optional) → not primary, Supabase is main DB
/prompts           → system prompts for AI
/docs              → architecture + system design docs
```

---

# 💡 SOURCE OF TRUTH MODEL

### 1. RAW DATA (Supabase)

* Transactions
* Accounts
* Budgets
* Goals

This is immutable truth.

---

### 2. DERIVED DATA (Backend logic)

* Monthly spending
* Category breakdowns
* Net worth calculations
* Trend analysis

These are computed from raw data.

---

### 3. AI INSIGHTS (Interpretation layer)

* Behavioral patterns
* Financial observations
* Suggestions
* Risk signals

These are probabilistic, not factual.

---

# 🔐 SECURITY MODEL

* Supabase Row Level Security enforced per user
* No cross-user data access
* Server-side Supabase operations for sensitive logic
* No financial secrets exposed to client or AI layer

---

# ⚙️ DEVELOPMENT PRIORITIES

1. Stable Supabase schema
2. Clean financial transaction system
3. Server-side business logic layer
4. AI integration layer (provider later)
5. Dashboard + analytics UI
6. Behavioral intelligence system

---

# 🎯 DESIGN PHILOSOPHY

Axiom is built to feel:

* minimal
* analytical
* calm
* structured
* intelligence-driven

Avoid:

* gamification noise
* unnecessary complexity
* multiple conflicting sources of truth
* emotional manipulation UX

---

# ⚠️ NON-NEGOTIABLE RULES

* There is only one source of truth: Supabase
* AI never writes financial data
* Business logic must not be duplicated across layers
* Derived metrics must always be traceable to transactions
* System must remain explainable at all times
