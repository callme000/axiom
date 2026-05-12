AXIOM

Axiom is a behavioral financial intelligence system designed to help users understand how capital is being deployed over time.

It is not a budgeting app.
It is not a passive expense tracker.

Axiom treats money as **deployable strategic capital**.

The system analyzes where capital flows, what behavioral patterns emerge, and whether those deployments are increasing or degrading long-term financial positioning.

🧠 CORE PRINCIPLE

Financial events are truth. Everything else is interpretation.

Axiom is built around three strict layers:

| Layer | Responsibility |
| :--- | :--- |
| **Financial Truth** | Immutable deployment records stored in Supabase |
| **Derived Intelligence** | Deterministic analytics (Burn, Runway, Allocation) |
| **Interpretation Layer** | Kairos behavioral insights (Strategic signals) |

🏗️ SYSTEM ARCHITECTURE (V2.4)

Axiom follows **Architecture A**:

```text
Next.js (UI + Server Actions)
        ↓
Application Logic Layer (/lib)
        ↓
Supabase (PostgreSQL + Auth)
        ↓
Kairos Intelligence Layer
```

🧭 ARCHITECTURAL PHILOSOPHY
The architecture exists to preserve **traceability, determinism, and explainability**.
- The frontend is purely for display and secure command entry.
- The database is the singular source of financial truth.
- Kairos interprets behavior but never mutates financial state.

🧠 RETURN-BASED TAXONOMY SYSTEM

Axiom classifies every dollar by its **expected return profile**.

| Category | Strategic Meaning |
| :--- | :--- |
| **Asset** | Expected future value generation (Equity, Crypto, Real Estate) |
| **Skill** | Improves future earning capability (Courses, Books, Coaching) |
| **Leverage** | Multiplies output or saves time (Software, Automation, Outsourcing) |
| **Experience** | Intentional quality-of-life deployment (Travel, Family) |
| **Leakage** | Non-strategic capital drift (Mindless spending without intent) |

💧 LIQUIDITY MANAGEMENT
The system tracks **Total Liquidity** to drive the **Operational Runway** engine. 
- **Total Liquidity** represents your total investable liquid capital (cash, near-cash assets).
- Users can update their "Truth" (starting balance) using the **"Set starting liquidity"** action in the header.
- Runway is calculated as: `Total Liquidity / Daily Burn Rate`.

📁 PROJECT STRUCTURE
- `/app` → Next.js routes + UI rendering
- `/lib/analytics` → Deterministic metrics + calculations
- `/lib/finance` → Taxonomy enforcement + validation
- `/lib/db` → Server-side Supabase access layer
- `/lib/context` → Strategic data compression for AI

🚫 NON-NEGOTIABLE RULES
1. AI never writes financial truth.
2. Financial logic cannot exist in multiple places.
3. Frontend state is never authoritative.
4. Taxonomy integrity must remain enforced via the **Taxonomy Gate**.

Axiom v1: Stabilized, Coherent, and Strategically Aware. (Production Locked)
