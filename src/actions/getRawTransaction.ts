import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_raw_transaction } from "../tools";

const getRawTransactionAction: Action = {
  name: "GET_RAW_TRANSACTION_ACTION",
  similes: [
    "get transaction details",
    "fetch raw transaction",
    "retrieve transaction",
  ],
  description: "Fetch the raw transaction data from Solana blockchain using its signature.",
  examples: [
    [
      {
        input: {
          signature: "TransactionSignature",
          isMainnet: true,
        },
        output: {
          status: "success",
          transaction: {
            // Example structure of transaction data
            "signature": "TransactionSignature",
            "message": {},
            "meta": {},
          },
        },
        explanation: "Fetch raw transaction from mainnet",
      },
    ],
    [
      {
        input: {
          signature: "NonExistentSignature",
          isMainnet: false,
        },
        output: {
          status: "error",
          message: "Raw transaction not found",
        },
        explanation: "Transaction not found on testnet",
      },
    ],
  ],
  schema: z.object({
    signature: z.string(),
    isMainnet: z.boolean(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_raw_transaction(agent, input.signature, input.isMainnet);
    
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

export default getRawTransactionAction;