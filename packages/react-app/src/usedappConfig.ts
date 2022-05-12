import { Arbitrum, ArbitrumRinkeby, Config, Kovan, Mainnet, NodeUrls, Optimism, OptimismKovan, ZkSyncTestnet } from "@usedapp/core";
import { isProduction } from "./isProduction";

const INFURA_PROJECT_ID = "defba93b47f748f09fcead8282b9e58e"; // TODO get our own Infura id, this is the one that ships with create-eth-app

const readOnlyChainId: number = isProduction ? Mainnet.chainId : Kovan.chainId;

const readOnlyUrls: NodeUrls = isProduction ? {
  [Mainnet.chainId]: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  [Optimism.chainId]: 'https://mainnet.optimism.io', // NB Optimism guidance is that this endpoint is not for production systems. They ask that you get your own optimism endpoint from Alchemy or Infura
  [Arbitrum.chainId]: 'https://arb1.arbitrum.io/rpc',
} : {
  [Kovan.chainId]: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
  [OptimismKovan.chainId]: 'https://kovan.optimism.io',
  [ArbitrumRinkeby.chainId]: 'https://rinkeby.arbitrum.io/rpc',
  [ZkSyncTestnet.chainId]: 'https://zksync2-testnet.zksync.dev',
};

export const config: Config = {
  readOnlyChainId,
  readOnlyUrls,
};

// allChainIds is the set of chainIds we support, ie. the set of chainIds loaded into our usedapp config
export const allChainIds: number[] = Object.keys(readOnlyUrls).map((s) => parseInt(s, 10));
