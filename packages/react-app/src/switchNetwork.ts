import { JsonRpcProvider } from "@ethersproject/providers";
import { Arbitrum, ArbitrumRinkeby, Kovan, Optimism, OptimismKovan } from "@usedapp/core";

// TODO this is a temporary library to switch the user's wallet network, including auto-adding of certain networks using hardcoded network definitions. This whole library can be replaced by wagmi's useNetwork/switchNetwork libs after we swap usedapp for wagmi, and our redundant network definitions here may be deleted

interface AddEthereumChainParameter { // https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

// WARNING HACK - this chain definition is redundant with our libs like usedappConfig and getChainName. This definition is only intended to make this short-term lib work, and should be removed when we switch to wagmi.
const addEthereumChainParameterByChainId: { [chainId: number]: AddEthereumChainParameter } = {
  // Here we expect definitinos for every network we support
  [Kovan.chainId]: {
    chainId: `0x${Kovan.chainId.toString(16)}`,
    chainName: 'Kovan',
    nativeCurrency: { name: 'Kovan Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://kovan.infura.io/v3/defba93b47f748f09fcead8282b9e58e'],
    blockExplorerUrls: ['https://kovan.etherscan.io/'],
  },
  [Optimism.chainId]: {
    chainId: `0x${Optimism.chainId.toString(16)}`,
    chainName: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
  },
  [OptimismKovan.chainId]: {
    chainId: `0x${OptimismKovan.chainId.toString(16)}`,
    chainName: 'Optimism Kovan',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://kovan.optimism.io'],
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io/'],
  },
  [Arbitrum.chainId]: {
    chainId: `0x${Arbitrum.chainId.toString(16)}`,
    chainName: 'Arbitrum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
  [ArbitrumRinkeby.chainId]: {
    chainId: `0x${ArbitrumRinkeby.chainId.toString(16)}`,
    chainName: 'Arbitrum Rinkeby',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io/'],
  },
};

export async function switchNetwork(provider: JsonRpcProvider, chainId: number) {
  try {
    await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${chainId.toString(16)}` }]);
  } catch (error) {
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    const p = addEthereumChainParameterByChainId[chainId];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof error === 'object' && (error as any).code === 4902 && p !== undefined) {
      await provider.send('wallet_addEthereumChain', [{
        chainId: p.chainId,
        chainName: p.chainName,
        rpcUrls: p.rpcUrls,
        nativeCurrency: p.nativeCurrency,
        blockExplorerUrls: p.blockExplorerUrls,
      }]);
      // metamask (only known implementer) automatically switches after a network is added
      // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
      // metamask's behavior when switching to the current network is just to return null (a no-op)
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${chainId.toString(16)}` }]);
      } catch (error) {
        console.debug('Added network but could not switch chains', error);
      }
    } else {
      // error wasn't due to an attempt to switch to an unrecognized network, so we re-throw it
      throw error;
    }
  }
}
