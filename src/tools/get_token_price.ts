import { z } from "zod";
import { SolanaAgentKit } from "../agent";

/**
 * Fetch the current price of a token using the Birdeye API
 * 
 * @param agent - SolanaAgentKit instance for managing API keys and other configurations (not used in this function)
 * @param token - The token address to fetch the price for
 * @returns Promise resolving to an object with status, price, or an error message
 */
export async function get_price(
  agent: SolanaAgentKit,
  token: string,
): Promise<{ 
  status: 'success' | 'error', 
  price?: number,
  message?: string
}> {
  try {
    const response = await fetch(
        `https://public-api.birdeye.so/defi/price/?address=${token}`,
        {
          headers: {
            Accept: "application/json",
            "X-API-KEY": process.env.BIRDEYE_API_KEY || "",
            "x-chain": "solana",
          },
        }
      );

    const json = await response.json();

    return {
      status: 'success',
      price: json?.data?.value || 0,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error fetching token price: ${(error as Error).message}`,
    };
  }
}