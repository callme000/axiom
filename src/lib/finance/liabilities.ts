export const LIABILITY_TYPES = [
  { value: "credit_card", label: "Credit Card" },
  { value: "mortgage", label: "Mortgage" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "student_loan", label: "Student Loan" },
  { value: "business_loan", label: "Business Loan" },
  { value: "line_of_credit", label: "Line of Credit" },
  { value: "other", label: "Other" },
] as const;

export type LiabilityType = (typeof LIABILITY_TYPES)[number]["value"];

export interface Liability {
  id: string;
  user_id: string;
  liability_name: string;
  liability_type: LiabilityType;
  outstanding_balance: number;
  interest_rate: number;
  is_paid_in_cadences: boolean;
  cadence: "weekly" | "monthly" | null;
  cadence_day_date: string | null;
  cadence_amount: number | null;
  last_executed_at?: string | null;
  due_date: string | null;
  currency: string;
  institution?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export function isValidLiabilityType(type: string): type is LiabilityType {
  return LIABILITY_TYPES.some((t) => t.value === type);
}

export function validateLiability(data: {
  liability_name: string;
  liability_type: string;
  outstanding_balance: number;
  interest_rate?: number;
  is_paid_in_cadences?: boolean;
  cadence?: string | null;
  cadence_day_date?: string | null;
  cadence_amount?: number | null;
}) {
  if (!data.liability_name || data.liability_name.trim().length === 0) {
    throw new Error("Liability name is required.");
  }

  if (!isValidLiabilityType(data.liability_type)) {
    throw new Error(`Invalid liability type: ${data.liability_type}`);
  }

  if (isNaN(data.outstanding_balance)) {
    throw new Error("Outstanding balance must be a number.");
  }

  const isPaidInCadences = !!data.is_paid_in_cadences;
  let cadence: "weekly" | "monthly" | null = null;
  let cadenceDayDate: string | null = null;
  let cadenceAmount: number | null = null;

  if (isPaidInCadences) {
    if (data.cadence !== "weekly" && data.cadence !== "monthly") {
      throw new Error("A valid cadence (weekly or monthly) is required.");
    }
    cadence = data.cadence;

    if (!data.cadence_day_date || data.cadence_day_date.trim().length === 0) {
      throw new Error("Cadence day/date is required.");
    }

    if (cadence === "monthly") {
      const dateNum = parseInt(data.cadence_day_date, 10);
      if (isNaN(dateNum) || dateNum < 1 || dateNum > 31) {
        throw new Error("Monthly cadence requires a valid date (1-31).");
      }
    } else if (cadence === "weekly") {
      const validDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      if (!validDays.includes(data.cadence_day_date.toLowerCase())) {
        throw new Error("Weekly cadence requires a valid day of the week.");
      }
    }
    cadenceDayDate = data.cadence_day_date;

    if (
      data.cadence_amount === undefined ||
      data.cadence_amount === null ||
      isNaN(data.cadence_amount)
    ) {
      throw new Error("Cadence payment amount is required.");
    }
    cadenceAmount = data.cadence_amount;
  }

  return {
    liability_name: data.liability_name.trim(),
    liability_type: data.liability_type as LiabilityType,
    outstanding_balance: data.outstanding_balance,
    interest_rate: data.interest_rate || 0,
    is_paid_in_cadences: isPaidInCadences,
    cadence,
    cadence_day_date: cadenceDayDate,
    cadence_amount: cadenceAmount,
  };
}
