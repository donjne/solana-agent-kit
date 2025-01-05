import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { getRPCUrl } from "../utils/getRpcUrl";
import { Connection } from "@solana/web3.js";

/**
 * Fetch a raw transaction from the Solana blockchain by its signature
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param signature - The transaction signature to fetch
 * @param isMainnet - Boolean indicating whether to use mainnet or not
 * @returns Promise resolving to an object with status, transaction data, or an error message
 */
export async function get_raw_transaction(
  agent: SolanaAgentKit,
  signature: string,
  isMainnet: boolean,
): Promise<{ 
  status: 'success' | 'error', 
  transaction?: any,
  message?: string
}> {
  try {
    const connection = new Connection(
      getRPCUrl(`?api-key=${process.env.HELIUS_API_KEY}`, isMainnet),
      "confirmed"
    );

    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) {
      return {
        status: 'error',
        message: "Raw transaction not found",
      };
    }

    return {
      status: 'success',
      transaction,
    };
  } catch (error) {
    return {
      status: 'error',
      message: "Error fetching raw transaction: " + (error as Error).message,
    };
  }
}