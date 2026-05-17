export const GOAL_TYPES = [
  { value: "emergency_fund", label: "Emergency Fund" },
  { value: "retirement", label: "Retirement" },
  { value: "home_purchase", label: "Home Purchase" },
  { value: "investment_target", label: "Investment Target" },
  { value: "business_runway", label: "Business Runway" },
  { value: "education", label: "Education" },
  { value: "debt_payoff", label: "Debt Payoff" },
  { value: "wealth_preservation", label: "Wealth Preservation" },
  { value: "other", label: "Other" },
] as const;

export type GoalType = (typeof GOAL_TYPES)[number]["value"];

export const GOAL_PRIORITIES = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export type GoalPriority = (typeof GOAL_PRIORITIES)[number]["value"];

export const GOAL_STATUSES = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "achieved", label: "Achieved" },
  { value: "archived", label: "Archived" },
] as const;

export type GoalStatus = (typeof GOAL_STATUSES)[number]["value"];

export interface FinancialGoal {
  id: string;
  user_id: string;
  goal_name: string;
  goal_type: GoalType;
  target_amount: number;
  current_progress: number;
  target_date: string | null;
  priority: GoalPriority;
  status: GoalStatus;
  linked_account_ids: string[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export function isValidGoalType(type: string): type is GoalType {
  return GOAL_TYPES.some((t) => t.value === type);
}

export function isValidPriority(priority: string): priority is GoalPriority {
  return GOAL_PRIORITIES.some((p) => p.value === priority);
}

export function isValidStatus(status: string): status is GoalStatus {
  return GOAL_STATUSES.some((s) => s.value === status);
}

export function validateGoal(data: {
  goal_name: string;
  goal_type: string;
  target_amount: number;
  current_progress?: number;
  priority: string;
  status: string;
}) {
  if (!data.goal_name || data.goal_name.trim().length === 0) {
    throw new Error("Goal name is required.");
  }

  if (!isValidGoalType(data.goal_type)) {
    throw new Error(`Invalid goal type: ${data.goal_type}`);
  }

  if (isNaN(data.target_amount) || data.target_amount <= 0) {
    throw new Error("Target amount must be a positive number.");
  }

  if (data.current_progress !== undefined && isNaN(data.current_progress)) {
    throw new Error("Current progress must be a number.");
  }

  if (!isValidPriority(data.priority)) {
    throw new Error(`Invalid priority: ${data.priority}`);
  }

  if (!isValidStatus(data.status)) {
    throw new Error(`Invalid status: ${data.status}`);
  }

  return {
    goal_name: data.goal_name.trim(),
    goal_type: data.goal_type as GoalType,
    target_amount: data.target_amount,
    current_progress: data.current_progress || 0,
    priority: data.priority as GoalPriority,
    status: data.status as GoalStatus,
  };
}

/**
 * Calculates deterministic goal progress.
 */
export function calculateGoalProgressPercentage(goal: Pick<FinancialGoal, 'current_progress' | 'target_amount'>): number {
  if (goal.target_amount <= 0) return 0;
  return Math.min(100, Math.max(0, (goal.current_progress / goal.target_amount) * 100));
}
