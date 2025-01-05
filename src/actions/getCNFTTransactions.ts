import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_cnft_transactions } from "../tools";

const getCNFTransactionsAction: Action = {
  name: "GET_CNFT_TRANSACTIONS_ACTION",
  similes: [
    "get cnft transactions",
    "fetch cnft history",
    "list cnft activities",
  ],
  description: "Retrieve transactions associated with a specific Compressed Non-Fungible Token (CNFT) on Solana.",
  examples: [
    [
      {
        input: {
          account: "CNFT_ID",
          isMainnet: true,
        },
        output: {
          status: "success",
          oldest: "OldestSignature",
          result: [
            // ... transaction data ...
          ],
        },
        explanation: "Fetch CNFT transactions on mainnet",
      },
    ],
    [
      {
        input: {
          account: "AnotherCNFT_ID",
          cursor: 2,
          isMainnet: false,
        },
        output: {
          status: "success",
          oldest: "NextOldestSignature",
          result: [
            // ... next page of transaction data ...
          ],
        },
        explanation: "Fetch next page of CNFT transactions on testnet",
      },
    ],
  ],
  schema: z.object({
    account: z.string(),
    cursor: z.number().optional().default(1),
    isMainnet: z.boolean(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_cnft_transactions(agent, input);
    
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

export default getCNFTransactionsAction;