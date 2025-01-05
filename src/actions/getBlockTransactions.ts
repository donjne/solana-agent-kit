import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_block_transactions } from "../tools";

const getBlockTransactionsAction: Action = {
  name: "GET_BLOCK_TRANSACTIONS_ACTION",
  similes: [
    "get block transactions",
    "fetch block details",
    "list block transactions",
  ],
  description: "Retrieve and process transactions for a specific block on Solana, filtering out vote transactions.",
  examples: [
    [
      {
        input: {
          slot: 123456,
          isMainnet: true,
        },
        output: {
          status: "success",
          oldest: "Signature1",
          result: [
            // ... transaction data ...
          ],
        },
        explanation: "Fetch transactions for a block on mainnet",
      },
    ],
    [
      {
        input: {
          slot: 789012,
          isMainnet: false,
          cursor: "PreviousSignature",
          limit: 50,
        },
        output: {
          status: "success",
          oldest: "Signature2",
          result: [
            // ... transaction data for next 50 transactions after cursor ...
          ],
        },
        explanation: "Fetch next 50 transactions after a cursor on testnet",
      },
    ],
  ],
  schema: z.object({
    cursor: z.string().optional(),
    isMainnet: z.boolean(),
    limit: z.number().min(1).max(100).optional(),
    slot: z.number(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_block_transactions(agent, input);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      oldest: result.oldest,
      result: result.result,
    };
  },
};

export default getBlockTransactionsAction;