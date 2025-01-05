import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { parseTransaction } from "../utils/parser";
import type { EnrichedTransaction } from "helius-sdk";
import { getRPCUrl } from "../utils/getRpcUrl";
import { getAPIUrl } from "../utils/getApiUrl"

type SignaturesResponse = {
    jsonrpc: string;
    result: {
        total: number;
        limit: number;
        page: number;
        items: string[][];
    };
    id: string;
};

/**
 * Fetch and process transactions related to a specific CNFT (Compressed Non-Fungible Token) on Solana
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param input - Object containing account (CNFT asset ID), optional cursor for pagination, and network type
 * @returns Promise resolving to an object with status, oldest transaction signature, transaction results, or an error message
 */
export async function get_cnft_transactions(
  agent: SolanaAgentKit,
  input: Record<string, any>,
): Promise<{ 
  status: 'success' | 'error', 
  oldest?: string,
  result?: any[],
  message?: string
}> {
  const { account, cursor = 1, isMainnet } = input;

  try {
    const url = getRPCUrl(`?api-key=${process.env.HELIUS_API_KEY}`, isMainnet);
    
    const response: SignaturesResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: "signatures",
        jsonrpc: "2.0",
        method: "getSignaturesForAsset",
        params: {
          id: account,
          limit: 50,
          page: cursor,
        },
      }),
    }).then(res => res.json());

    const signatures = response.result.items.map(([signature]) => signature);

    if (!signatures || signatures.length === 0) {
      return {
        status: 'success',
        oldest: "",
        result: [],
      };
    }

    const transactionUrl = getAPIUrl(
      `/v0/transactions/?api-key=${process.env.HELIUS_API_KEY}`,
      isMainnet
    );

    const transactions: EnrichedTransaction[] = 
      (await fetch(transactionUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: signatures,
        }),
      }).then(res => res.json())) || [];

    const result = transactions.map(tx => parseTransaction(tx)) || [];

    return {
      status: 'success',
      oldest: signatures[signatures.length - 1],
      result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching CNFT transactions: ${(error as Error).message}`,
    };
  }
}