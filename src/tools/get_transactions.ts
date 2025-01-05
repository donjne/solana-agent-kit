import type { EnrichedTransaction } from "helius-sdk";
import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { parseTransaction } from "../utils/parser";
import { getAPIUrl } from "../utils/getApiUrl";

/**
 * Fetch and parse transactions for a specific account on Solana, with options for filtering and pagination
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param input - Object containing account, optional cursor, filter, network type, and user context
 * @returns Promise resolving to an object with status, oldest transaction signature, transaction results, or an error message
 */
export async function get_transactions(
  agent: SolanaAgentKit,
  input: Record<string, any>,
): Promise<{ 
  status: 'success' | 'error', 
  oldest?: string,
  result?: any[],
  message?: string
}> {
  const { account, cursor, filter, isMainnet, user } = input;

  try {
    const url = getAPIUrl(
      `/v0/addresses/${account}/transactions?api-key=${process.env.HELIUS_API_KEY}${
        filter ? `&type=${filter}` : ""
      }${cursor ? `&before=${cursor}` : ""}`,
      isMainnet
    );

    const response = await fetch(url);
    if (!response.ok) {
      return {
        status: 'error',
        message: "Failed to fetch transactions",
      };
    }

    const json: EnrichedTransaction[] = await response.json();

    const result = json.map((tx) => parseTransaction(tx, user)) || [];

    return {
      status: 'success',
      oldest: json[json.length - 1]?.signature || "",
      result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: "Error fetching transactions: " + (error as Error).message,
    };
  }
}