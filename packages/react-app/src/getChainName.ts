import { DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core";

// NB we might be tempted to implement getChainName using our usedappConfig.ts, however, our Config object is only a partial until it's injected into usedapp and merged with default config, including DEFAULT_SUPPORTED_CHAINS. So, if we implement getChainName using our usedapp config, it'll always fail because our config.networks is undefined.

const UNKNOWN_CHAIN = "unknown";

// getChainName returns the chain name for the passed chainId or
// UNKNOWN_CHAIN if the passed chainId is not found.
export function getChainName(chainId: number): string {
  const n = DEFAULT_SUPPORTED_CHAINS.find(n => n.chainId === chainId); // O(chains) and in the distance future may want to implement a lookup table of chainId -> chainName that's built statically upon module initialization
  return n === undefined ? UNKNOWN_CHAIN : n.chainName;
}
