// actions/getConcurrentMerkleTree.ts
import { Action } from "../types/action";
import { SolanaAgentKit } from "../agent";
import { z } from "zod";
import { get_concurrent_merkle_tree } from "../tools";

const getConcurrentMerkleTreeAction: Action = {
  name: "GET_CONCURRENT_MERKLE_TREE_ACTION",
  similes: [
    "get merkle tree details",
    "fetch merkle tree",
    "concurrent merkle tree info",
  ],
  description: "Retrieve details of a Concurrent Merkle Tree on Solana, used for compressed NFTs and other data structures.",
  examples: [
    [
      {
        input: {
          address: "MerkleTreeAddress",
          isMainnet: true,
        },
        output: {
          status: "success",
          result: {
            authority: "AuthorityPublicKey",
            canopyDepth: 10,
            // ... other properties ...
          },
        },
        explanation: "Fetch details of a Concurrent Merkle Tree on mainnet",
      },
    ],
  ],
  schema: z.object({
    address: z.string(),
    isMainnet: z.boolean(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await get_concurrent_merkle_tree(agent, input);
    
    if (result.status === 'error') {
      return {
        status: "error",
        message: result.message,
      };
    }

    return {
      status: "success",
      result: result.result,
    };
  },
};

export default getConcurrentMerkleTreeAction;