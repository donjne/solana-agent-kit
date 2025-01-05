import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { getRPCUrl } from "../utils/getRpcUrl";
import { ConcurrentMerkleTreeAccount } from "@solana/spl-account-compression";
import { PublicKey, Connection } from "@solana/web3.js";

/**
 * Fetch and process details of a Concurrent Merkle Tree on Solana
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param input - Object containing the address of the Merkle Tree and network type
 * @returns Promise resolving to an object with status, Merkle Tree details, or an error message
 */
export async function get_concurrent_merkle_tree(
  agent: SolanaAgentKit,
  input: Record<string, any>,
): Promise<{ 
  status: 'success' | 'error', 
  result?: {
    authority: PublicKey;
    canopyDepth: number;
    creationSlot: number;
    maxBufferSize: number;
    rightMostIndex: number;
    root: Buffer;
    seq: string;
    treeHeight: number;
  },
  message?: string
}> {
  const { address, isMainnet } = input;

  try {
    const connection = new Connection(
      getRPCUrl(`?api-key=${process.env.HELIUS_API_KEY}`, isMainnet),
      "confirmed"
    );

    const pubkey = new PublicKey(address);
    const cmt = await ConcurrentMerkleTreeAccount.fromAccountAddress(
      connection,
      pubkey
    );

    const result = {
      authority: cmt.getAuthority(),
      canopyDepth: cmt.getCanopyDepth(),
      creationSlot: cmt.getCreationSlot().toNumber(),
      maxBufferSize: cmt.getMaxBufferSize(),
      rightMostIndex: cmt.tree.rightMostPath.index,
      root: cmt.getCurrentRoot(),
      seq: cmt.getCurrentSeq().toString(),
      treeHeight: cmt.getMaxDepth(),
    };

    return {
      status: 'success',
      result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching Concurrent Merkle Tree details: ${(error as Error).message}`,
    };
  }
}