// get_assets.ts
import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { getRPCUrl } from "../utils/getRpcUrl";

/**
 * Fetch all assets owned by a specific account address from Solana, with pagination support
 * 
 * @param agent - SolanaAgentKit instance for managing network and keys
 * @param input - Object containing account address, optional cursor for pagination, and network type
 * @returns Promise resolving to an object with status, asset results, or an error message
 */
export async function get_assets(
  agent: SolanaAgentKit,
  input: Record<string, any>,
): Promise<{ 
  status: 'success' | 'error', 
  result?: any,
  message?: string
}> {
  const { cursor = 1, account, isMainnet } = input;

  try {
    // API key should be managed securely, ideally from environment variables
    const heliusApiKey = process.env.HELIUS_API_KEY;
    if (!heliusApiKey) throw new Error("Helius API key not provided");

    const url = getRPCUrl(`?api-key=${heliusApiKey}`, isMainnet);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: "get-assets-" + account,
        jsonrpc: "2.0",
        method: "getAssetsByOwner",
        params: {
          limit: 1000,
          ownerAddress: account,
          page: cursor,
          sortBy: {
            sortBy: "created",
            sortDirection: "desc",
          },
        },
      }),
    });

    const result = await response.json();

    return {
      status: 'success',
      result: result?.result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching assets: ${(error as Error).message}`,
    };
  }
}