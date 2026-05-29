import { AccountType } from "../finance/accounts";
import { LiabilityType } from "../finance/liabilities";
import { IncomeType } from "../finance/income";
import { ValidCategory } from "../finance/taxonomy";

/**
 * TAXONOMY MAPPING DICTIONARY
 * Localizes abstract database enums to Kenyan market realities.
 */

export const AccountMap: Record<AccountType, string> = {
  checking: "M-Pesa / Bank",
  savings: "Savings / MMF",
  mobile_money: "M-Pesa",
  brokerage: "Investment / CDS",
  crypto: "Digital Assets",
  cash: "Cash on Hand",
};

export const LiabilityMap: Record<LiabilityType, string> = {
  credit_card: "Credit Card / Digital Loan",
  mortgage: "Mortgage / Shamba Loan",
  personal_loan: "Fuliza / SACCO Loan",
  student_loan: "HELB / Education Loan",
  business_loan: "Business / SME Loan",
  line_of_credit: "Overdraft facility",
  other: "Other Credit Facilities",
};

export const IncomeMap: Record<IncomeType, string> = {
  salary: "Salary / Hustle",
  freelance: "Freelance / Gig Work",
  business: "Business Yield",
  dividends: "Dividends / Chama Payout",
  rental: "Rental Income",
  contract: "Contract Fee",
  other: "Other Inflows",
};

export const DeploymentMap: Record<ValidCategory, string> = {
  Asset: "MMF / Chama / Equities",
  Skill: "Upskilling / Certifications",
  Leverage: "Tools / Automation",
  Experience: "Lifestyle / Experiences",
  Maintenance: "Basic Survival (Rent/Food)",
  Leakage: "M-Pesa Leakage / Unclassified",
};
