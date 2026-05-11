AXIOM

Axiom is a behavioral financial intelligence system designed to help users understand how capital is being deployed over time.

It is not a budgeting app.

It is not a passive expense tracker.

Axiom treats money as:

deployable strategic capital.

The system analyzes where capital flows, what behavioral patterns emerge, and whether those deployments are increasing or degrading long-term financial positioning.

🧠 CORE PRINCIPLE

Financial events are truth. Everything else is interpretation.

Axiom is built around three strict layers:

Layer	Responsibility
Financial Truth	Immutable deployment records
Derived Intelligence	Deterministic analytics
Interpretation Layer	Kairos behavioral insights

The system is intentionally designed so that:

raw financial data remains authoritative
analytics remain reproducible
interpretation remains non-authoritative
🏗️ SYSTEM ARCHITECTURE

Axiom follows Architecture A:

Next.js (UI + Server Actions)
        ↓
Application Logic Layer (/lib)
        ↓
Supabase (PostgreSQL + Auth)
        ↓
Kairos Intelligence Layer
🧭 ARCHITECTURAL PHILOSOPHY

The architecture exists to preserve:

traceability
determinism
explainability
strict data ownership boundaries

The frontend is never authoritative.

The database is always the source of financial truth.

Kairos interprets behavior but cannot mutate financial state.

🗄️ DATABASE MODEL (SUPABASE)

Axiom uses Supabase for:

PostgreSQL storage
Authentication
Row Level Security (RLS)
User isolation
🔐 SOURCE OF TRUTH MODEL
1. FINANCIAL TRUTH (Canonical Layer)

Stored in Supabase:

deployments
accounts
categories
goals
behavioral metadata

These are immutable financial records.

This layer is authoritative.

2. DERIVED ANALYTICS (Deterministic Layer)

Computed from raw financial events:

capital allocation
daily burn rate
operational runway
category concentration
capital efficiency
trend analysis

These values are reproducible from underlying records.

No derived value exists without traceable source data.

3. INTERPRETATION LAYER (Kairos)

Kairos generates:

behavioral observations
allocation warnings
efficiency analysis
strategic signals
trend interpretations

Kairos does NOT:

create financial truth
overwrite records
modify balances
fabricate data

Kairos is interpretative only.

🧠 RETURN-BASED TAXONOMY SYSTEM

Axiom classifies deployments according to expected return profile.

The system intentionally avoids traditional “expense categories.”

Core Categories
Category	Meaning
Asset	Expected future value generation
Skill	Improves earning capability
Leverage	Multiplies output or saves time
Experience	Intentional quality-of-life deployment
Leakage	Non-strategic or impulsive deployment
⚠️ TAXONOMY ENFORCEMENT

Axiom enforces strict classification integrity.

Rules:

every deployment must be intentionally classified
“Leakage” cannot occur silently
invalid categories are rejected before DB write
all inputs are normalized before persistence

Validation is enforced through:

src/lib/finance/validateDeployment.ts

This creates:

analytics consistency
insight reliability
long-term behavioral coherence
🤖 KAIROS ENGINE

Kairos is the behavioral intelligence layer of Axiom.

It is intentionally:

restrained
analytical
minimal
deterministic

Kairos behaves like:

an operational analyst observing capital behavior over time.

NOT:

a chatbot
a motivational coach
a conversational assistant
🧠 BEHAVIORAL PRESENCE SYSTEM

Kairos includes a Behavioral Presence Layer.

The goal is:

make the system feel observant without becoming theatrical.

This includes:

post-deployment insight reactions
temporal trend awareness
narrative continuity
insight severity prioritization
signal filtering and deduplication

Kairos only speaks when:

meaningful behavioral changes occur
strategic conditions deteriorate
allocation patterns shift materially

Silence is intentional.

📊 CORE ANALYTICS ENGINE

Current deterministic analytics include:

Daily Burn Rate
Projected Operational Runway
Capital Allocation Distribution
Category Trend Analysis
Capital Efficiency Signals

These calculations live inside:

src/lib/analytics

The UI never owns analytical truth.

📁 PROJECT STRUCTURE
/app
  → Next.js routes + UI rendering

/components
  → visual system components

/lib
  /analytics
    → deterministic metrics + calculations

  /finance
    → validation + financial rules

  /db
    → Supabase access layer

  /kairos
    → behavioral interpretation engine

  /types
    → shared domain types

/prompts
  → future AI/system prompts

/docs
  → architecture + system documentation
🔐 SECURITY MODEL

Axiom assumes all client input is untrusted.

Security guarantees:

strict Row Level Security (RLS)
user-isolated financial truth
authenticated access only
server-side sensitive operations
no service role key exposure
no direct AI write access
⚙️ ENGINEERING PRINCIPLES
1. Single Source of Truth

Supabase owns canonical financial state.

2. Deterministic Analytics

All metrics must be traceable to financial events.

3. Strict Layer Separation

UI, analytics, persistence, and interpretation remain isolated.

4. Explainability Over Complexity

Prefer understandable systems over opaque automation.

5. Controlled Intelligence

Kairos interprets behavior but never becomes authoritative.

🚫 NON-NEGOTIABLE RULES
AI never writes financial truth
financial logic cannot exist in multiple places
frontend state is never authoritative
derived metrics must remain reproducible
all strategic insights must trace back to deployments
taxonomy integrity must remain enforced
🎯 PRODUCT PHILOSOPHY

Axiom is designed to feel:

analytical
restrained
calm
precise
operational
intelligence-driven

Avoid:

gamification
dopamine loops
noisy AI behavior
manipulative UX
inflated productivity theatrics
