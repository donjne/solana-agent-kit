// get_account_info.ts
import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../agent";
import { getRPCUrl } from '../utils/getRpcUrl';

/**
 * Retrieve detailed information about a Solana account using Helius API through a custom RPC connection
 * 
 * @param agent - SolanaAgentKit instance containing connection details
 * @param accountAddress - Optional address of the account to query. If not provided, uses agent's wallet address
 * @returns Promise resolving to an object with status, account information, or an error message
 */
export async function get_account_info(
  agent: SolanaAgentKit,
  accountAddress?: string,
): Promise<{ 
  status: 'success' | 'error', 
  account?: {
    context: { slot: number };
    value: {
      data: any;
      executable: boolean;
      lamports: number;
      owner: PublicKey;
      rentEpoch?: number;
    } | null;
    balance: number;
  },
  message?: string
}> {
  const address = accountAddress || agent.wallet_address.toBase58();
  const pubKey = new PublicKey(address);

  try {
    // API key should be managed securely, ideally from environment variables
    const heliusApiKey = process.env.HELIUS_API_KEY;
    if (!heliusApiKey) throw new Error("Helius API key not provided");

    // Determine if we're on mainnet by checking the rpcEndpoint string
    const isMainnet = agent.connection.rpcEndpoint.includes("mainnet");

    // Use the utility function to get the RPC URL
    const rpcUrl = getRPCUrl(`?api-key=${heliusApiKey}`, isMainnet);
    
    // Create a new connection with the Helius RPC URL
    const connection = new Connection(rpcUrl, "confirmed");

    // Fetch account details using the Solana connection
    const accountInfo = await connection.getParsedAccountInfo(pubKey);

    return {
      status: 'success',
      account: {
        ...accountInfo,
        balance: (accountInfo?.value?.lamports || 0) / LAMPORTS_PER_SOL
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching account info: ${(error as Error).message}`,
    };
  }
}