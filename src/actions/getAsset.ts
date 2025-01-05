import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_asset } from "../tools";

const getAssetAction: Action = {
  name: "GET_ASSET_ACTION",
  similes: [
    "get asset details",
    "fetch asset info",
    "retrieve asset",
  ],
  description: "Fetch detailed information about a specific asset on Solana, including compressed NFT data.",
  examples: [
    [
      {
        input: {
          asset: "AssetIdHere",
          isMainnet: true,
        },
        output: {
          status: "success",
          metadata: {
            address: "AssetAddress",
            name: "Asset Name",
            // ... other metadata fields
          },
        },
        explanation: "Get details for a compressed asset on mainnet",
      },
    ],
    [
      {
        input: {
          asset: "AnotherAssetId",
          isMainnet: false,
        },
        output: {
          status: "success",
          metadata: {
            // ... uncompressed asset data
          },
        },
        explanation: "Fetch an uncompressed asset from a testnet",
      },
    ],
  ],
  schema: z.object({
    asset: z.string(),
    isMainnet: z.boolean(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_asset(agent, input.asset, input.isMainnet);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      metadata: result.metadata,
    };
  },
};

export default getAssetAction;