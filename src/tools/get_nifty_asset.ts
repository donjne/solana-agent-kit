import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { PublicKey, Connection } from "@solana/web3.js";
import { getRPCUrl } from "../utils/getRpcUrl";
import { getInternalAssetAccountDataSerializer } from "@nifty-oss/asset";

/**
 * Fetch and deserialize asset account data for a Nifty asset on Solana
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param address - The address of the asset to fetch
 * @param isMainnet - Boolean indicating whether to use mainnet or not
 * @returns Promise resolving to an object with status, deserialized asset data, or an error message
 */
export async function get_nifty_asset(
  agent: SolanaAgentKit,
  address: string,
  isMainnet: boolean,
): Promise<{ 
  status: 'success' | 'error', 
  assetData?: any,
  message?: string
}> {
  try {
    const connection = new Connection(
      getRPCUrl(`?api-key=${process.env.HELIUS_API_KEY}`, isMainnet),
      "confirmed"
    );

    const pubKey = new PublicKey(address);

    const accountInfo = await connection.getAccountInfo(pubKey);

    if (accountInfo) {
      const assetData = getInternalAssetAccountDataSerializer().deserialize(accountInfo.data);
      return {
        status: 'success',
        assetData,
      };
    } else {
      return {
        status: 'success',
        assetData: null,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching Nifty asset data: ${(error as Error).message}`,
    };
  }
}