import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { Username } from "../types";

/**
 * Fetch Solana domain names associated with a given address using Helius API
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param address - Optional address to query for domain names. If not provided, uses agent's wallet address
 * @returns Promise resolving to an object indicating success or failure, with associated domain names if successful
 */
export async function get_solana_domain(
  agent: SolanaAgentKit,
  address?: string,
): Promise<{ 
  status: 'success' | 'error', 
  usernames?: Username[],
  message?: string
}> {
  const queryAddress = address || agent.wallet_address.toBase58();

  try {
    const heliusApiKey = process.env.HELIUS_API_KEY;
    if (!heliusApiKey) throw new Error("Helius API key not provided");

    const url = `https://api.helius.xyz/v0/addresses/${queryAddress}/names?api-key=${heliusApiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data?.domainNames) {
      const usernames: Username[] = data.domainNames.map((domain: string) => ({
        type: "bonfida",
        username: `${domain}.sol`,
      }));
      
      return {
        status: 'success',
        usernames: usernames,
      };
    } else {
      return {
        status: 'success',
        usernames: [],
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching domain names: ${(error as Error).message}`,
    };
  }
}