import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_assets } from "../tools";

const getAssetsAction: Action = {
  name: "GET_ASSETS_ACTION",
  similes: [
    "get all assets",
    "fetch account assets",
    "list owned assets",
  ],
  description: "Retrieve all assets owned by a specific Solana account with pagination support.",
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
            // ... asset data ...
          ],
        },
        explanation: "Fetch first page of assets for an account on mainnet",
      },
    ],
    [
      {
        input: {
          account: "AnotherAccountAddress",
          cursor: 2,
          isMainnet: false,
        },
        output: {
          status: "success",
          result: [
            // ... next page of asset data ...
          ],
        },
        explanation: "Fetch the second page of assets for an account on testnet",
      },
    ],
  ],
  schema: z.object({
    account: z.string(),
    cursor: z.number().optional(),
    isMainnet: z.boolean(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_assets(agent, input);
    
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

export default getAssetsAction;