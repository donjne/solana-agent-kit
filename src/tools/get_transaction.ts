import type { EnrichedTransaction } from "helius-sdk";
import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { parseTransaction } from "../utils/parser";
import { getAPIUrl } from "../utils/getApiUrl";

/**
 * Fetch and parse a specific transaction from the Solana blockchain using Helius API
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param input - Object containing transaction signature, optional account, and network type
 * @returns Promise resolving to an object with status, parsed transaction data, or an error message
 */
export async function get_transaction(
  agent: SolanaAgentKit,
  input: Record<string, any>,
): Promise<{ 
  status: 'success' | 'error', 
  transaction?: any,
  message?: string
}> {
  const { account, isMainnet, transaction: transactionSignature } = input;

  try {
    const url = getAPIUrl(
      `/v0/transactions/?api-key=${process.env.HELIUS_API_KEY}`,
      isMainnet
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions: [transactionSignature],
      }),
    });

    if (!response.ok) {
      return {
        status: 'error',
        message: "Transaction not found",
      };
    }

    const [tx]: EnrichedTransaction[] = await response.json();

    const parsed = parseTransaction(tx, account);

    if (parsed === undefined) {
      return {
        status: 'error',
        message: "Transaction not found",
      };
    }

    parsed.raw = tx;

    return {
      status: 'success',
      transaction: parsed,
    };
  } catch (error) {
    return {
      status: 'error',
      message: "Error fetching transaction: " + (error as Error).message,
    };
  }
}