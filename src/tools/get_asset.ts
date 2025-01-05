import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { getRPCUrl } from "../utils/getRpcUrl";
import { UITokenMetadata } from "../types";

/**
 * Fetch asset details for a given asset ID on Solana, handling both compressed and uncompressed assets
 * 
 * @param agent - SolanaAgentKit instance for managing network and keys
 * @param asset - The asset ID to fetch details for
 * @param isMainnet - Boolean indicating whether to use mainnet or not
 * @returns Promise resolving to an object with status, asset metadata, or an error message
 */
export async function get_asset(
  agent: SolanaAgentKit,
  asset: string,
  isMainnet: boolean,
): Promise<{ 
  status: 'success' | 'error', 
  metadata?: UITokenMetadata,
  message?: string
}> {
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
        id: "asset",
        jsonrpc: "2.0",
        method: "getAsset",
        params: {
          id: asset,
          options: {
            showFungible: true,
          },
        },
      }),
    });

    const data = await response.json();

    let metadata: UITokenMetadata | undefined;

    if (data?.result?.compression?.compressed === true) {
      const assetData = await fetch(data.result.content.json_uri);
      const returnAssetData = await assetData.json();

      metadata = {
        address: data?.result?.id || "",
        assetHash: data?.result?.compression?.asset_hash,
        attributes: returnAssetData?.attributes || [],
        burnt: data?.result?.burnt,
        collectionKey: data?.result?.grouping[0]?.group_value || "",
        compressed: true,
        creatorHash: data?.result?.compression?.creator_hash,
        creators: data?.result?.creators || [],
        dataHash: data?.result?.compression?.data_hash,
        delegate: data?.result?.ownership?.delegated ? data?.result?.ownership?.delegate : "",
        description: returnAssetData?.description || "",
        frozen: data?.result?.ownership?.frozen,
        image: returnAssetData?.image || "",
        leafId: data?.result?.compression?.leaf_id,
        mintExtensions: data?.result?.mint_extensions || "",
        mutable: data?.result?.mutable,
        name: returnAssetData?.name || "",
        owner: data?.result?.ownership?.owner || "",
        sellerFeeBasisPoints: data?.result?.royalty.basis_points || 0,
        seq: data?.result?.compression?.seq,
        tree: data?.result?.compression?.tree,
      };
    }

    return {
      status: 'success',
      metadata: metadata ?? data?.result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching asset: ${(error as Error).message}`,
    };
  }
}