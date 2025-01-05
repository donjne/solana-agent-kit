import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { getRPCUrl } from "../utils/getRpcUrl";

/**
 * Search for assets owned by an account on Solana, with options for filtering and pagination
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param input - Object containing search criteria like account address, cursor, network type, etc.
 * @returns Promise resolving to an object with status, search results, or an error message
 */
export async function search_assets(
  agent: SolanaAgentKit,
  input: Record<string, any>,
): Promise<{ 
  status: 'success' | 'error', 
  result?: any,
  message?: string
}> {
  const {
    account,
    cursor = 1,
    isMainnet,
    tokenType = "all",
    nativeBalance = false,
  } = input;

  try {
    const url = getRPCUrl(`/?api-key=${process.env.HELIUS_API_KEY}`, isMainnet);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: "my-id",
        jsonrpc: "2.0",
        method: "searchAssets",
        params: {
          displayOptions: {
            showNativeBalance: nativeBalance,
          },
          limit: 1000,
          ownerAddress: account,
          page: cursor,
          sortBy: { sortBy: "id", sortDirection: "asc" },
          tokenType,
        },
      }),
    });

    const { result } = await response.json();

    return {
      status: 'success',
      result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error searching assets: ${(error as Error).message}`,
    };
  }
}