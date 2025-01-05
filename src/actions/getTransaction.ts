import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_transaction } from "../tools";

const getTransactionAction: Action = {
  name: "GET_TRANSACTION_ACTION",
  similes: [
    "get transaction details",
    "fetch transaction",
    "retrieve transaction",
  ],
  description: "Fetch and parse a specific transaction from Solana blockchain.",
  examples: [
    [
      {
        input: {
          transaction: "TransactionSignature",
          isMainnet: true,
        },
        output: {
          status: "success",
          transaction: {
            // Example structure of parsed transaction
            "accounts": [],
            "actions": [],
            "fee": 0.005,
            // ... other fields
            "raw": {} // Raw transaction data
          },
        },
        explanation: "Fetch and parse a transaction from mainnet",
      },
    ],
    [
      {
        input: {
          transaction: "AnotherTransactionSignature",
          account: "AccountAddress",
          isMainnet: false,
        },
        output: {
          status: "success",
          transaction: {
            // Example structure with account context
          },
        },
        explanation: "Fetch transaction on testnet with account context",
      },
    ],
  ],
  schema: z.object({
    account: z.string().optional(),
    isMainnet: z.boolean(),
    transaction: z.string(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_transaction(agent, input);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      transaction: result.transaction,
    };
  },
};

export default getTransactionAction;