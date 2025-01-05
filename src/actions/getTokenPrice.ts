import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_price } from "../tools";

const getPriceAction: Action = {
  name: "GET_PRICE_ACTION",
  similes: [
    "get token price",
    "fetch price",
    "check token value",
  ],
  description: "Fetch the current market price of a given token on Solana using the Birdeye API.",
  examples: [
    [
      {
        input: {
          token: "TokenMintAddress",
        },
        output: {
          status: "success",
          price: 10.5, // Example price
        },
        explanation: "Fetch the price of a specific token",
      },
    ],
  ],
  schema: z.object({
    token: z.string(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_price(agent, input.token);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      price: result.price,
    };
  },
};

export default getPriceAction;