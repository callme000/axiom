import { SupabaseClient } from "@supabase/supabase-js";
import { Account } from "@/lib/analytics/types";
import { getAccounts } from "@/lib/db/accounts";
import { updateLiquidity } from "@/lib/db/settings";

/**
 * Domain service responsible for liquidity calculations and synchronization.
 * Truth: Liquidity is the aggregate of all liquid account balances.
 */
export const LiquidityService = {
  /**
   * Pure function to calculate total liquidity from a list of accounts.
   */
  calculateTotal(accounts: Account[]): number {
    return accounts.reduce((sum, account) => sum + Number(account.current_balance || 0), 0);
  },

  /**
   * Synchronizes the global total_liquidity setting with the current state of accounts.
   * This should be called whenever an account balance changes.
   */
  async sync(supabase: SupabaseClient, userId: string): Promise<number> {
    const accountsData = await getAccounts(supabase);
    const accounts = (accountsData || []) as Account[];

    const totalLiquidity = this.calculateTotal(accounts);

    await updateLiquidity(supabase, userId, totalLiquidity);

    return totalLiquidity;
  }
};
