// import { PublicKey } from "@solana/web3.js";
import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_account_info } from "../tools";

const accountInfoAction: Action = {
  name: "ACCOUNT_INFO_ACTION",
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
            balance: "100 SOL",
            executable: false,
            owner: "YourWalletAddress",
            lamports: 100000000000,
            data: {
              program: "ProgramAddress",
            },
            tokenAccounts: [
              {
                mint: "TokenMintAddress",
                amount: 100.00,
                // ... more token account fields
              }
            ],
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
            balance: "50 SOL",
            executable: false,
            owner: "AnotherWalletAddress",
            lamports: 50000000000,
            data: {
              program: "ProgramAddress",
            },
            tokenAccounts: [
              {
                mint: "AnotherTokenMintAddress",
                amount: 200.00,
                // ... more token account fields
              }
            ],
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

    // Here, we want to return the account data in a structured format
    return {
      status: "success",
      account: result.account,
    };
  },
};

export default accountInfoAction;