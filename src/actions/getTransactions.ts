import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_transactions } from "../tools";

const getTransactionsAction: Action = {
  name: "GET_TRANSACTIONS_ACTION",
  similes: [
    "get account transactions",
    "fetch transaction history",
    "list transactions",
  ],
  description: "Fetch and parse transactions for a specific account on Solana with options for filtering and pagination.",
  examples: [
    [
      {
        input: {
          account: "AccountAddress",
          isMainnet: true,
        },
        output: {
          status: "success",
          oldest: "OldestSignature",
          result: [
            // Example structure of parsed transactions
            {
              "accounts": [],
              "actions": [],
              "fee": 0.005,
              // ... other fields
            },
          ],
        },
        explanation: "Fetch transactions for an account on mainnet",
      },
    ],
    [
      {
        input: {
          account: "AnotherAccountAddress",
          cursor: "PreviousSignature",
          filter: "transfer",
          isMainnet: false,
          user: "UserPublicKey",
        },
        output: {
          status: "success",
          oldest: "NextOldestSignature",
          result: [
            // Example filtered transactions with user context
          ],
        },
        explanation: "Fetch transfer transactions before a given signature on testnet with user context",
      },
    ],
  ],
  schema: z.object({
    account: z.string(),
    cursor: z.string().optional(),
    filter: z.string().optional(),
    isMainnet: z.boolean(),
    user: z.string().optional(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_transactions(agent, input);
    
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

export default getTransactionsAction;