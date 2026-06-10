---
name: axiom-truth-enforcement
description: An active guardian that strictly prohibits optimistic UI updates or local React state management for critical financial totals (Net Worth, Runway, Burn). It forces reliance purely on server-side revalidation and deterministic calculations from the DashboardSnapshot.
---

# Axiom Truth Enforcement

This skill ensures that Axiom remains a "Bloomberg Terminal for Personal Finance" by enforcing deterministic integrity. We prioritize **Database Truth** over **UI Responsiveness**.

## Core Mandates

### 1. No Optimistic UI for Critical Metrics
NEVER implement optimistic updates (local state projections) for the following metrics:
- **Net Worth**
- **Runway Days / Days of Solvency**
- **Daily Burn Rate / Adjusted Burn**
- **Global Liquidity**

**Rationale**: These metrics are calculated through complex systemic interpretations (including burn windows, liability interest, and income offsets). Projecting them in the UI is high-risk and leads to "hallucinated solvency."

### 2. The Truth Protocol (Mutation Flow)
Every mutation (Create/Update/Delete) MUST follow this exact sequence:
1. **Execute DB Write**: Use server actions to modify the database.
2. **Sync Liquidity**: Call `LiquidityService.sync()` if any account balance or deployment changes.
3. **Revalidate Path**: Use `revalidatePath("/dashboard")` to clear Next.js caches.
4. **Fetch Fresh Snapshot**: Call `SnapshotService.getSnapshot()` with `forceInsightEvaluation: true`.
5. **Update UI**: The UI must only update when the new `DashboardSnapshot` is returned from the action.

### 3. Liquidity Integrity
- **Truth**: Global liquidity is the aggregate of all liquid account balances.
- **Rule**: `LiquidityService.sync` is the ONLY authoritative way to update the `total_liquidity` setting.
- **Trigger Awareness**: Some deductions (e.g., creating a Deployment) are handled by database triggers. The UI/Server Action must call `sync()` AFTER the trigger has fired to ensure the global pool reflects the deduction.

### 4. Deterministic Analytics
- All financial intelligence must be interpreted by `src/lib/analytics/engine.ts`.
- NEVER rewrite calculation logic in components. If a component needs a derivative metric, add it to `AnalyticsSummary` in the engine.

## Implementation Patterns

### Wrong: Optimistic Local State
```typescript
// Component-level state - PROHIBITED
const [netWorth, setNetWorth] = useState(initialNetWorth);
const handleAddDeployment = async (amount) => {
  setNetWorth(prev => prev - amount); // HALLUCINATION
  await createDeploymentAction(...);
}
```

### Right: Server-Driven Truth
```typescript
// Component uses the snapshot from the server action response
const { snapshot } = useDashboard(); // Or passed via props
const handleAddDeployment = async (data) => {
  const newSnapshot = await createDeploymentAction(data);
  // The state update is handled by the higher-level container or re-render
}
```
