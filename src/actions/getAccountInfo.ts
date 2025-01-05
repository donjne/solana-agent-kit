// actions/getAccountInfo.ts
import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_account_info } from "../tools";

const getAccountInfoAction: Action = {
  name: "GET_ACCOUNT_INFO_ACTION",
  similes: [
    "get account info",
    "account details",
    "view account",
    "check account",
    "account information",
  ],
  description: `Retrieve detailed information about a Solana account including balance, 
  token accounts, and other account details. If no account address is provided, 
  it defaults to the agent's wallet.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          account: {
            context: { slot: 123 }, // Example value
            value: {
              data: "exampleData",
              executable: false,
              lamports: 100000000000,
              owner: "YourWalletAddress",
              rentEpoch: 123 // Example value
            },
            balance: 100.0, // Example value
          },
        },
        explanation: "Get info for the agent's own wallet",
      },
    ],
    [
      {
        input: {
          accountAddress: "AnotherWalletAddress",
        },
        output: {
          status: "success",
          account: {
            context: { slot: 456 }, // Example value
            value: {
              data: "anotherExampleData",
              executable: false,
              lamports: 50000000000,
              owner: "AnotherWalletAddress",
              rentEpoch: 456 // Example value
            },
            balance: 50.0, // Example value
          },
        },
        explanation: "Get info for a specific account",
      },
    ],
  ],
  schema: z.object({
    accountAddress: z.string().optional(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_account_info(agent, input.accountAddress);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      account: result.account,
    };
  },
};

export default getAccountInfoAction;