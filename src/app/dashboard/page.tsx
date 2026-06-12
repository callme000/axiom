import { getDashboardSnapshotAction } from "./actions";
import { DashboardClient } from "./DashboardClient";

/**
 * DASHBOARD SERVER COMPONENT (RSC)
 * Adheres to 'Axiom Truth Enforcement' by fetching authoritative data on the server.
 */
export default async function DashboardPage() {
  // Fetch authoritative snapshot directly on the server
  const snapshot = await getDashboardSnapshotAction();

  return <DashboardClient initialSnapshot={snapshot} />;
}
