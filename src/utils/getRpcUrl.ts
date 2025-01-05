export function getRPCUrl(path: string, isMainnet: boolean = true): string {
    const baseUrl = isMainnet
        ? "https://mainnet.helius-rpc.com"
        : "https://devnet.helius-rpc.com";
    return `${baseUrl}/${path}`;
}