import { Arbitrum, ArbitrumRinkeby, Config, Kovan, Mainnet, Optimism, OptimismKovan } from "@usedapp/core";
import { isProduction } from "./isProduction";

const INFURA_PROJECT_ID = "defba93b47f748f09fcead8282b9e58e"; // TODO get our own Infura id, this is the one that ships with create-eth-app

export const config: Config = isProduction ? {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    [Optimism.chainId]: 'https://mainnet.optimism.io', // NB Optimism guidance is that this endpoint is not for production systems. They ask that you get your own optimism endpoint from Alchemy or Infura
    [Arbitrum.chainId]: 'https://arb1.arbitrum.io/rpc',
  },
} : {
  readOnlyChainId: Kovan.chainId,
  readOnlyUrls: {
    [Kovan.chainId]: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    [OptimismKovan.chainId]: 'https://kovan.optimism.io',
    [ArbitrumRinkeby.chainId]: 'https://rinkeby.arbitrum.io/rpc',
  },
};
