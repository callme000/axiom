# Axiom Financial Mutation Patterns

## Description
Enforces domain-specific rules around financial mutations, orchestration, snapshots, and state synchronization within the Axiom project. This skill ensures structural integrity and absolute truth in financial calculations.

## Triggers
Activate this skill when:
- Writing, modifying, or reviewing Server Actions or API routes.
- Implementing new financial features, accounts, or transactions.
- Updating balances, liquidity, or account states.
- Integrating Kairos AI with financial data.
- Designing or modifying React components that display financial totals or state.
- Performing any backend mutation of financial truth.

## Instructions

The following domain-specific rules MUST be strictly enforced. General AI knowledge of React/Next.js/Supabase does not supersede these Axiom-specific business logic patterns.

### 1. Orchestration Layer Mandate
All mutations **MUST** pass through the orchestration layer. Direct database mutations for financial truth from disparate components or raw Server Actions without orchestration are strictly prohibited.

### 2. Sequential Snapshots
Snapshot generation **MUST** happen *after* mutation. A mutation is not considered complete until the updated state has been snapshotted for historical/dashboard accuracy.

### 3. Kairos is Read-Only for Truth
Kairos NEVER mutates financial truth. It is an observer, behavioral tracker, and insight generator. Financial facts are strictly maintained by the core engine and orchestration layer.

### 4. Targeted Liquidity Sync
Liquidity synchronization **ONLY** occurs when account state changes. Do not trigger global or unrelated liquidity syncs arbitrarily.

### 5. No Local Computation of Truth
NO component may compute financial truth locally. Components must rely purely on server-side revalidation and deterministic calculations derived from the server and Snapshot data. Do not use local React state (`useState`, `useReducer`) to optimistically calculate new totals or net worth.

### 6. Thin Server Actions
Server Actions must remain **thin**. They should act merely as bridges passing authenticated requests to the orchestration layer and domain services. They should not house complex mutation, validation, or business logic themselves.

## Rationale
AI assistants are generally excellent at utilizing frameworks (React, Tailwind, Next.js, Supabase). However, the most dangerous mistakes occur when deviating from project-specific business rules. This skill exists to explicitly define and enforce Axiom's boundary conditions for financial truth and orchestration.
