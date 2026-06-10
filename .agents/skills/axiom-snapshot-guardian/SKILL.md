---
name: axiom-snapshot-guardian
description: Manage the orchestration layer (SnapshotService). Prevent circular dependencies, N+1 queries, and ensure that every mutation follows the exact path of Mutate → Revalidate → Snapshot → Persist Insight.
---

# Axiom Snapshot Guardian

The `SnapshotService` is the heart of Axiom's orchestration layer. It is responsible for gathering all disparate financial data and transforming it into a single, cohesive `DashboardSnapshot`.

## Core Mandates

### 1. Strict CQRS (Command Query Responsibility Segregation)
The `SnapshotService.getSnapshot` method is a **PURE QUERY**.
- It must NEVER perform database writes (inserts, updates, or deletes).
- Exception: It returns a `volatileState.requiresPersistence` flag if the AI generates a new signal. The CALLER (e.g., a Server Action) is responsible for persisting that insight.

### 2. Orchestration Hierarchy
- `SnapshotService` sits at the TOP of the domain layer.
- It orchestrates:
    - `src/lib/db/*`: Data retrieval.
    - `src/lib/analytics/engine.ts`: Business logic & calculations.
    - `src/lib/ai/kairos.ts`: Strategic signal evaluation.
- **Circular Dependency Check**: No database utility or analytics engine should ever import `SnapshotService`.

### 3. Mutation Orchestration Pattern
All Server Actions that modify financial state MUST use the following orchestration pattern:
1. **DB Update**: Perform the requested change.
2. **Post-Update Hooks**: Sync liquidity, etc.
3. **Revalidation**: `revalidatePath("/dashboard")`.
4. **Snapshot Capture**: 
   ```typescript
   const { snapshot, volatileState } = await SnapshotService.getSnapshot(supabase, userId, { 
     forceInsightEvaluation: true 
   });
   ```
5. **Persistence of Volatile State**: If `volatileState.requiresPersistence` is true, save the `snapshot.kairosInsight`.
6. **Return**: Return the `snapshot`.

### 4. Efficient Data Gathering
- Use `Promise.all` for parallel data fetching in `getSnapshot`.
- Avoid N+1 queries. If you need data from multiple tables, fetch them in bulk at the start of the snapshot process.

### 5. AI Evaluation (Kairos Integration)
- `getSnapshot` is the primary entry point for Kairos AI evaluations.
- Use `forceInsightEvaluation: true` during mutations to ensure the user gets immediate feedback on their actions.
- Use cached insights (default behavior) for standard page loads to reduce latency and AI cost.

## Orchestration Flow Diagram
```
Client Request (Action) 
  → DB Mutation 
  → revalidatePath()
  → SnapshotService.getSnapshot()
      → Parallel DB Reads (Accounts, Deployments, etc.)
      → Analytics Engine (Deterministic Summary)
      → Kairos AI (Heuristic Strategic Signal)
  → Persist Signal (if volatile)
  → Return DashboardSnapshot to Client
```
