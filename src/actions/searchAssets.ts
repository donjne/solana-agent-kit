import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { search_assets } from "../tools";

const searchAssetsAction: Action = {
  name: "SEARCH_ASSETS_ACTION",
  similes: [
    "search assets",
    "find owned tokens",
    "list account assets",
  ],
  description: "Search for all assets owned by a specific Solana account with options for filtering and pagination.",
  examples: [
    [
      {
        input: {
          account: "AccountAddress",
          isMainnet: true,
        },
        output: {
          status: "success",
          result: [
            // Example asset data
          ],
        },
        explanation: "Search for all assets owned by an account on mainnet",
      },
    ],
    [
      {
        input: {
          account: "AnotherAccountAddress",
          cursor: 2,
          isMainnet: false,
          tokenType: "nft",
          nativeBalance: true,
        },
        output: {
          status: "success",
          result: [
            // Example NFT data with native balance included
          ],
        },
        explanation: "Search for NFTs on testnet with native balance included",
      },
    ],
  ],
  schema: z.object({
    account: z.string(),
    cursor: z.number().optional(),
    isMainnet: z.boolean(),
    nativeBalance: z.boolean().optional(),
    tokenType: z.string().optional(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await search_assets(agent, input);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      result: result.result,
    };
  },
};

export default searchAssetsAction;