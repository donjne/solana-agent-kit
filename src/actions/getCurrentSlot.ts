import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_current_slot } from "../tools";

const getCurrentSlotAction: Action = {
  name: "GET_CURRENT_SLOT_ACTION",
  similes: [
    "get current slot",
    "fetch slot",
    "current blockchain slot",
  ],
  description: "Retrieve the most recent slot number from the Solana blockchain.",
  examples: [
    [
      {
        input: {
          isMainnet: true,
        },
        output: {
          status: "success",
          slot: 123456789, // Example slot number
        },
        explanation: "Fetch the current slot on mainnet",
      },
    ],
    [
      {
        input: {
          isMainnet: false,
        },
        output: {
          status: "success",
          slot: 987654321, // Example slot number
        },
        explanation: "Fetch the current slot on testnet",
      },
    ],
  ],
  schema: z.object({
    isMainnet: z.boolean(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_current_slot(agent, input.isMainnet);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      slot: result.slot,
    };
  },
};

export default getCurrentSlotAction;