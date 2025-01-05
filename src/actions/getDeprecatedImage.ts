import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_deprecated_image } from "../tools";

const getDeprecatedImageAction: Action = {
  name: "GET_DEPRECATED_IMAGE_ACTION",
  similes: [
    "get token image",
    "fetch token logo",
    "retrieve token icon",
  ],
  description: "Fetch the image URL for a token, using deprecated methods if available, otherwise using current API.",
  examples: [
    [
      {
        input: {
          account: "TokenMintAddress",
        },
        output: {
          status: "success",
          imageUrl: "ImageUrlHere",
        },
        explanation: "Fetch token image, first from deprecated source, then from current API",
      },
    ],
  ],
  schema: z.object({
    account: z.string(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_deprecated_image(agent, input.account);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      imageUrl: result.imageUrl,
    };
  },
};

export default getDeprecatedImageAction;