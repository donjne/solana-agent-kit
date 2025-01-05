import { z } from "zod";
import { SolanaAgentKit } from "../agent";
import { getAPIUrl } from "../utils/getApiUrl";

/**
 * Attempt to fetch a token's image URL, prioritizing the deprecated method and falling back to current API
 * 
 * @param agent - SolanaAgentKit instance for managing connections and keys
 * @param account - The token account address to fetch the image for
 * @returns Promise resolving to an object with status, image URL, or an error message
 */
export async function get_deprecated_image(
  agent: SolanaAgentKit,
  account: string,
): Promise<{ 
  status: 'success' | 'error', 
  imageUrl?: string,
  message?: string
}> {
  try {
    // Try fetching the image from the deprecated token-list
    const deprecatedUrl = `https://github.com/solana-labs/token-list/blob/main/assets/mainnet/${account}/logo.png?raw=true`;
    const response = await fetch(deprecatedUrl);
    
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("image/png")) {
      return {
        status: 'success',
        imageUrl: deprecatedUrl,
      };
    } else {
      // Fallback to the current Helius API for metadata
      const url = getAPIUrl(
        `/v0/token-metadata/?api-key=${process.env.HELIUS_API_KEY}`,
        true
      );
      const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          includeOffChain: true,
          mintAccounts: [account],
        }),
      });
      const json = await apiResponse.json();
      const imageUrl = json[0]?.legacyMetadata?.logoURI ?? "";

      return {
        status: 'success',
        imageUrl: imageUrl || undefined,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching token image: ${(error as Error).message}`,
    };
  }
}