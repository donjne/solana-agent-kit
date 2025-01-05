// get_block_transactions.ts
import type { EnrichedTransaction } from "helius-sdk";
import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { parseTransaction } from "../utils/parser";
import { 
    VOTE_PROGRAM_ID,
    type ConfirmedTransactionMeta,
    type TransactionSignature,
    Connection,
} from "@solana/web3.js";
import { getRPCUrl } from "../utils/getRpcUrl";

type TransactionWithInvocations = {
    index: number;
    signature?: TransactionSignature | undefined;
    meta: ConfirmedTransactionMeta | null;
    invocations: Map<string, number>;
};

const voteFilter = VOTE_PROGRAM_ID.toBase58();

/**
 * Fetch and process transactions for a specific block on Solana, providing detailed transaction information
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param input - Object containing slot, optional cursor, limit, and network type
 * @returns Promise resolving to an object with status, oldest transaction signature, transaction results, or an error message
 */
export async function get_block_transactions(
  agent: SolanaAgentKit,
  input: Record<string, any>,
): Promise<{ 
  status: 'success' | 'error', 
  oldest?: string,
  result?: any[],
  message?: string
}> {
  const { cursor, isMainnet, limit = 100, slot } = input;
  const invokedPrograms = new Map<string, number>();

  try {
    const connection = new Connection(
      getRPCUrl(`?api-key=${process.env.HELIUS_API_KEY}`, isMainnet),
      "confirmed"
    );

    const block = await connection.getBlock(slot, {
      maxSupportedTransactionVersion: 0,
    });

    if (!block?.transactions || block.transactions.length === 0) {
      return {
        status: 'success',
        oldest: "",
        result: [],
      };
    }

    const transactions: TransactionWithInvocations[] = block.transactions.map((tx, index) => {
        let signature: TransactionSignature | undefined;
        if (tx.transaction.signatures.length > 0) {
          signature = tx.transaction.signatures[0];
        }
      
        const programIndexes = 
          tx.transaction.message.compiledInstructions
            .map((ix) => ix.programIdIndex)
            .concat(
              tx.meta?.innerInstructions?.flatMap((ix) => {
                return ix.instructions.map(ix => ix.programIdIndex);
              }) || []
            );
      
        const invocations = programIndexes.reduce(
          (acc, programIndex) => {
            const programId = tx.transaction.message.getAccountKeys({
              accountKeysFromLookups: tx.meta?.loadedAddresses ?? null,
            }).get(programIndex)!.toBase58();
      
            const programTransactionCount = invokedPrograms.get(programId) || 0;
            invokedPrograms.set(programId, programTransactionCount + 1);
      
            const count = acc.get(programId) || 0;
            acc.set(programId, count + 1);
      
            return acc;
          },
          new Map<string, number>()
        );
      
        return {
          index,
          invocations,
          meta: tx.meta,
          signature,
        };
      });

    // Filters out vote transactions -> Returns a list of the transaction signatures
    let signatureList = transactions
      .filter(({ invocations }) => 
        !(invocations.has(voteFilter) && invocations.size === 1)
      )
      .map(({ signature }) => signature);

    if (!signatureList?.length) {
      return {
        status: 'success',
        oldest: "",
        result: [],
      };
    }

    if (cursor) {
      const lastTransactionIndex = signatureList.indexOf(cursor);
      if (lastTransactionIndex >= 0) {
        signatureList = signatureList.slice(lastTransactionIndex + 1);
      }
    }

    signatureList = signatureList.slice(0, limit);

    const url = `https://api.helius.xyz/v0/transactions/?api-key=${process.env.HELIUS_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions: signatureList,
      }),
    });

    const json: EnrichedTransaction[] = await response.json();

    const result = json.map((tx) => parseTransaction(tx)) || [];

    return {
      status: 'success',
      oldest: signatureList?.slice(-1)?.[0] || "",
      result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching block transactions: ${(error as Error).message}`,
    };
  }
}