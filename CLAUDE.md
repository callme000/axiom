# CLAUDE.md — AXIOM Architectural Laws

This document defines the non-negotiable architectural laws of the Axiom system. All development must adhere to these 5 Pillars to prevent logic drift and maintain financial integrity.

## 1. The Database is Absolute Truth
- **Server-Side Authority**: All data mutations MUST occur through Next.js Server Actions.
- **Identity Enforcement**: Server Actions MUST explicitly call `requireAuth()` to derive the `userId`. Never trust a `userId` passed from the client.
- **RLS is Absolute**: Row Level Security (RLS) must be enabled on every table. Code must be written assuming RLS is the final line of defense.

## 2. Ledger Immutability
- **Hard Deletes are Banned**: No record representing a financial event or state may be permanently deleted.
- **Soft Delete Pattern**: All transactional tables MUST use a `deleted_at` timestamp column.
- **Read Consistency**: Every read query must filter for active records using `.is("deleted_at", null)`.

## 3. The Mapping Layer Pattern (Localization)
- **Abstract Schema**: Database enums and types must remain generic (e.g., `"loan"`, `"checking"`, `"mobile_money"`).
- **Taxonomy Translation**: The UI must never display raw database enums. It MUST intercept and translate these using the `taxonomy.ts` mapping dictionary (e.g., mapping `"loan"` to `"Fuliza / SACCO Loan"` based on context).
- **Currency Standard**: All financial values are strictly Kenyan Shillings (KES) and must be formatted accordingly.

## 4. AI Sandboxing (Kairos)
- **Read-Only Observer**: Kairos AI is a passive intelligence layer. It is strictly prohibited from mutating data or initiating transactions.
- **Deterministic Input**: Kairos must consume the `BehavioralContext` (derived from `analytics`) and map it through the `registry.ts` interpretation layer.
- **The Philosophy of Silence**: Kairos must gracefully handle the "Quiet System" state. If no rules are triggered, it remains silent. Silence is a valid and preferred state of certainty.

## 5. Telemetry & Observability
- **Non-Blocking Execution**: The engine must log execution latency, rule hits, and pipeline performance via the asynchronous telemetry service.
- **Asynchronous Logging**: Telemetry operations must never block the main UI thread or delay the delivery of financial figures to the user.
