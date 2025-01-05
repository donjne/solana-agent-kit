import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_solana_domain } from "../tools";

const getSolanaDomainAction: Action = {
  name: "GET_SOLANA_DOMAIN_ACTION",
  similes: [
    "get solana domain",
    "fetch solana username",
    "retrieve domain name",
  ],
  description: "Fetch Solana domain names associated with a given address or the agent's wallet.",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          usernames: [
            { type: "bonfida", username: "example.sol" }
          ],
        },
        explanation: "Get domain names for the agent's own wallet",
      },
    ],
    [
      {
        input: {
          address: "AnotherWalletAddress",
        },
        output: {
          status: "success",
          usernames: [],
        },
        explanation: "No domains found for the specified address",
      },
    ],
  ],
  schema: z.object({
    address: z.string().optional(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_solana_domain(agent, input.address);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      usernames: result.usernames,
    };
  },
};

export default getSolanaDomainAction;