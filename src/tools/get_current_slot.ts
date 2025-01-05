import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { Connection } from "@solana/web3.js";
import { getRPCUrl } from "../utils/getRpcUrl";

/**
 * Retrieve the current slot of the Solana blockchain
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param isMainnet - Boolean indicating whether to use mainnet or not
 * @returns Promise resolving to an object with status, current slot number, or an error message
 */
export async function get_current_slot(
  agent: SolanaAgentKit,
  isMainnet: boolean,
): Promise<{ 
  status: 'success' | 'error', 
  slot?: number,
  message?: string
}> {
  try {
    const connection = new Connection(
      getRPCUrl(`?api-key=${process.env.HELIUS_API_KEY}`, isMainnet),
      "confirmed"
    );

    const slot = await connection.getSlot();

    return {
      status: 'success',
      slot,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching current slot: ${(error as Error).message}`,
    };
  }
}