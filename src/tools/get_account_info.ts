import { LAMPORTS_PER_SOL, Connection, PublicKey, ParsedAccountData } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SolanaAgentKit } from "../agent";
import { getRPCUrl } from '../utils/getRpcUrl';
import { HeliusAccountInfo } from "../types"; 


/**
 * Retrieve detailed information about a Solana account using Helius API through a custom RPC connection
 * 
 * @param agent - SolanaAgentKit instance containing connection details
 * @param accountAddress - Optional address of the account to query. If not provided, uses agent's wallet address
 * @returns Promise resolving to an object containing account information or an error message
 */
export async function get_account_info(
  agent: SolanaAgentKit,
  accountAddress?: string,
): Promise<{ 
  status: 'success' | 'error', 
  account?: HeliusAccountInfo,
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

    if (!accountInfo.value) {
      return {
        status: 'error',
        message: 'Account not found',
      };
    }

    // Fetch token accounts associated with this address
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
        programId: TOKEN_PROGRAM_ID,
    });

    // Process the token accounts
    const parsedTokenAccounts = tokenAccounts.value.map(account => ({
        // Basic token information
        mint: account.account.data.parsed.info.mint,
        amount: account.account.data.parsed.info.tokenAmount.uiAmount,
        uiAmountString: account.account.data.parsed.info.tokenAmount.uiAmountString,
        decimals: account.account.data.parsed.info.tokenAmount.decimals,
        address: account.pubkey.toBase58(),  // The address of the token account itself
        state: account.account.data.parsed.info.state,
        
        // Owner details
        owner: account.account.data.parsed.info.owner,
        
        // If the token account is delegated
        delegate: account.account.data.parsed.info.delegateOption?.delegate ?? null,
        delegatedAmount: account.account.data.parsed.info.delegateOption?.delegatedAmount ?? null,
        
        // If there's a close authority
        closeAuthority: account.account.data.parsed.info.closeAuthorityOption?.closeAuthority ?? null,
        
        // Token extensions if any
        extensions: account.account.data.parsed.info.extensions ?? [],
    
        // Add additional metadata from the token account, if available
        isNative: account.account.data.parsed.info.isNativeOption?.isNative ?? false,
        rentExemptReserve: account.account.data.parsed.info.isNativeOption?.rentExemptReserve ?? null,
    
        // Program ID of the token account, should match TOKEN_PROGRAM_ID for SPL tokens
        programId: account.account.owner.toBase58(),
    }));

    // Here, we simulate what Helius data might look like, but we're actually fetching from Solana
    const heliusData: HeliusAccountInfo = {
      balance: `${(accountInfo.value.lamports || 0) / LAMPORTS_PER_SOL} SOL`,
      executable: accountInfo.value.executable || false,
      owner: accountInfo.value.owner.toBase58(),
      lamports: accountInfo.value.lamports || 0,
      data: {
        program: accountInfo.value.owner.toBase58(),
      },
      tokenAccounts: parsedTokenAccounts || [], 
    };

    return {
      status: 'success',
      account: heliusData,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching account info: ${(error as Error).message}`,
    };
  }
}