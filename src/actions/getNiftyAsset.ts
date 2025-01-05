import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_nifty_asset } from "../tools";

const getNiftyAssetAction: Action = {
  name: "GET_NIFTY_ASSET_ACTION",
  similes: [
    "get nifty asset",
    "fetch nifty details",
    "retrieve nifty data",
  ],
  description: "Retrieve and deserialize asset account data for a Nifty asset on Solana.",
  examples: [
    [
      {
        input: {
          address: "NiftyAssetAddress",
          isMainnet: true,
        },
        output: {
          status: "success",
          assetData: {
            // Example structure of deserialized data
            "field1": "value1",
            "field2": "value2",
          },
        },
        explanation: "Fetch Nifty asset data on mainnet",
      },
    ],
    [
      {
        input: {
          address: "AnotherNiftyAssetAddress",
          isMainnet: false,
        },
        output: {
          status: "success",
          assetData: null,
        },
        explanation: "Nifty asset not found on testnet",
      },
    ],
  ],
  schema: z.object({
    address: z.string(),
    isMainnet: z.boolean(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_nifty_asset(agent, input.address, input.isMainnet);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      assetData: result.assetData,
    };
  },
};

export default getNiftyAssetAction;