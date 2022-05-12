import { Arbitrum, ArbitrumRinkeby, Dai, Ether, Kovan, KovanDai, Mainnet, NativeCurrency, Optimism, OptimismKovan, Token, ZkSyncTestnet } from "@usedapp/core";
import { isProduction } from "./isProduction";
import { NonEmptyArray } from "./NonEmptyArray";

// WARNING currencies defined here won't actually work at runtime unless an rpc url is defined for their chainId in the loaded @useDapp/core.Config.

// In our token registry, every production network has a single
// testnet. Here, we have adopted Kovan as the single testnet for
// mainnet.
// Mainnet chainId: 1
// Kovan chainId: 42
// https://chainlist.org/
const KovanEther = new NativeCurrency('Ether', 'ETH', Kovan.chainId);
const WETH = new Token('Wrapped Ether', 'WETH', Mainnet.chainId, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18);
const KovanWETH = new Token('Wrapped Ether', 'WETH', Kovan.chainId, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18);
const USDC = new Token('USD Coin', 'USDC', Mainnet.chainId, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6);
const KovanUSDC = new Token('USD Coin', 'USDC', Kovan.chainId, '0x50dC5200082d37d5dd34B4b0691f36e3632fE1A8', 6);
const USDT = new Token('Tether USD', 'USDT', Mainnet.chainId, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6);
const KovanUSDT = new Token('Tether USD', 'USDT', Kovan.chainId, '0xe0BB0D3DE8c10976511e5030cA403dBf4c25165B', 6);

// Optimism token list (for mainnet and Optimism Kovan https://static.optimism.io/optimism.tokenlist.json)
// Optimism mainnet chainId: 10
// Optimism Kovan chainId: 69
const OptimismEther = new NativeCurrency('Ether', 'ETH', Optimism.chainId);
const OptimismKovanEther = new NativeCurrency('Ether', 'ETH', OptimismKovan.chainId);
const OptimismWETH = new Token('Wrapped Ether', 'WETH', Optimism.chainId, '0x4200000000000000000000000000000000000006', 18);
const OptimismKovanWETH = new Token('Wrapped Ether', 'WETH', OptimismKovan.chainId, '0x4200000000000000000000000000000000000006', 18);
const OptimismDai = new Token('Dai', 'DAI', Optimism.chainId, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1');
const OptimismKovanDai = new Token('Dai', 'DAI', OptimismKovan.chainId, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1');
const OptimismUSDC = new Token('USD Coin', 'USDC', Optimism.chainId, '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', 6); // TODO OptimismUSDC matches the contract address in the explorer, https://optimistic.etherscan.io/token/0x7f5c764cbc14f9669b88837ca1490cca17c31607 but it seems to fail to load based on a quick test with our TokenBalance component returning '?'
const OptimismKovanUSDC = new Token('USD Coin', 'USDC', OptimismKovan.chainId, '0x3e22e37Cb472c872B5dE121134cFD1B57Ef06560', 6); // unsure: optimism's tokenlist lists OptimismKovanUSDC as 0x4e62882864fB8CE54AFfcAf8D899A286762B011B, but 0x3e22e37Cb472c872B5dE121134cFD1B57Ef06560 is what I get when I receive faucet USDC
const OptimismUSDT = new Token('Tether USD', 'USDT', Optimism.chainId, '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', 6);
const OptimismKovanUSDT = new Token('Tether USD', 'USDT', OptimismKovan.chainId, '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', 6); // TODO WARNING not sure why this addresss is the same as OptimismUSDC but that's how it is defined in the Optimism token list

// Arbitrum mainnet token list: https://bridge.arbitrum.io/token-list-42161.json
// Arbitrum rinkeby token list: https://bridge.arbitrum.io/token-list-421611.json
// Arbitrum mainnet chainId: 42161
// Arbitrum Rinkeby chainId: 421611
const ArbitrumEther = new NativeCurrency('Ether', 'ETH', Arbitrum.chainId);
const ArbitrumRinkebyEther = new NativeCurrency('Ether', 'ETH', ArbitrumRinkeby.chainId);
const ArbitrumWETH = new Token('Wrapped Ether', 'WETH', Arbitrum.chainId, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18);
const ArbitrumRinkebyWETH = new Token('Wrapped Ether', 'WETH', ArbitrumRinkeby.chainId, '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681', 18);
const ArbitrumDai = new Token('Dai', 'DAI', Arbitrum.chainId, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1');
const ArbitrumRinkebyDai = new Token('Dai', 'DAI', ArbitrumRinkeby.chainId, '0x2f3c1b6a51a469051a22986aa0ddf98466cc8d3c');
const ArbitrumUSDC = new Token('USD Coin', 'USDC', Arbitrum.chainId, '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', 6);
const ArbitrumRinkebyUSDC = new Token('USD Coin', 'USDC', ArbitrumRinkeby.chainId, '0x1E77ad77925Ac0075CF61Fb76bA35D884985019d', 6);
const ArbitrumUSDT = new Token('Tether USD', 'USDT', Arbitrum.chainId, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 6);
// const ArbitrumRinkebyUSDT = new Token('Tether USD', 'USDT', ArbitrumRinkeby.chainId, '', 6); // TODO unsure of Tether address on Arbitrum Rinkeby

// ZkSync Goerli token list: https://zksync2-testnet.zkscan.io/tokens
// ZkSync Goerli chainId: 280
const ZkSyncGoerliEther = new NativeCurrency('Ether', 'ETH', ZkSyncTestnet.chainId);
// TODO ZkSyncGoerliWETH, unsure of WETH address on ZkSyncGoerli
const ZkSyncGoerliDai = new Token('Dai', 'DAI', ZkSyncTestnet.chainId, '0xE8c7cE6Ee9Fc75196bC5317883bD73A0F4ac7Bc0');
const ZkSyncGoerliUSDC = new Token('USD Coin', 'USDC', ZkSyncTestnet.chainId, '0x51A86f7c855e2Ccef4DeCE8b90409C2a639641E5', 6); // TODO multiple USDC tokens appear on ZkSync Goerli, which is correct?
const ZkSyncGoerliUSDT = new Token('Tether USD', 'USDT', ZkSyncTestnet.chainId, '0x192D8955DBCB4a811ED73715894504e16A5F4466', 6); // TODO multiple USDT tokens appear on ZkSync Goerli, which is correct?

// TEST a shorter list of native currencies for testing purposes
// export const nativeCurrencies2: Readonly<NonEmptyArray<NativeCurrency>> = isProduction ? [
//   Ether,
// ] : [
//   KovanEther,
// ];

// nativeCurrencies is our static global definition of all supported native currencies for all supported chains.
export const nativeCurrencies: Readonly<NonEmptyArray<NativeCurrency>> = isProduction ? [
  Ether,
  OptimismEther,
  ArbitrumEther,
] : [
  KovanEther,
  OptimismKovanEther,
  ArbitrumRinkebyEther,
  ZkSyncGoerliEther,
];

// TEST a shorter list of tokens for testing purposes
// export const tokens2: Readonly<NonEmptyArray<Token>> = isProduction ? [
//   Dai,
// ] : [
//   KovanDai,
// ];

// tokens is our static global definition of all supported erc20 tokens for all supported chains.
export const tokens: Readonly<NonEmptyArray<Token>> = isProduction ? [
  // Here we group the tokens by ticker and not chain because `tokens` is used to generate the canonical token ordering in allTokenKeys and our supposition is that in a multichain UX, the user would rather see all their DAIs together than all their Optimism assets, although this is somewhat contrary to how the rest of the ecosystem works right now where most apps support connecting to only one chain at a time and so naturally render all assets for one chain, effectively sorting by chain before ticker
  WETH,
  OptimismWETH,
  ArbitrumWETH,
  Dai,
  OptimismDai,
  ArbitrumDai,
  USDC,
  OptimismUSDC,
  ArbitrumUSDC,
  USDT,
  OptimismUSDT,
  ArbitrumUSDT,
] : [
  KovanWETH,
  OptimismKovanWETH,
  ArbitrumRinkebyWETH,
  KovanDai,
  OptimismKovanDai,
  ArbitrumRinkebyDai,
  ZkSyncGoerliDai,
  KovanUSDC,
  OptimismKovanUSDC,
  ArbitrumRinkebyUSDC,
  ZkSyncGoerliUSDC,
  KovanUSDT,
  OptimismKovanUSDT,
  ZkSyncGoerliUSDT,
];

export type TokenKey = string // see getTokenKey

// getTokenKey returns a string that uniquely identifies the passed
// NativeCurrency or Token, suitable to be used as a hashing or object
// key.
export function getTokenKey(t: NativeCurrency | Token): TokenKey {
  return `${t.ticker}-${t.chainId}`;
}

// allTokenKeys is a list of all TokenKeys for both nativeCurrencies
// and tokens that also provides a canonical ordering of all TokenKeys
// to help clients display tokens in a deterministic, stable order.
export const allTokenKeys: Readonly<TokenKey[]> = (() => {
  const tks: TokenKey[] = [];
  for (const nc of nativeCurrencies) {
    tks.push(getTokenKey(nc));
  }
  for (const t of tokens) {
    tks.push(getTokenKey(t));
  }
  return tks;
})();

const tokensByTokenKey: Readonly<{ [tk: TokenKey]: NativeCurrency | Token }> = (() => {
  const r: { [tk: TokenKey]: NativeCurrency | Token } = {};
  for (const nc of nativeCurrencies) {
    r[getTokenKey(nc)] = nc;
  }
  for (const t of tokens) {
    r[getTokenKey(t)] = t;
  }
  return r;
})();

export const tokensByTicker: Readonly<{ [ticker: string]: NonEmptyArray<NativeCurrency | Token> }> = (() => {
  const r: { [ticker: string]: NonEmptyArray<NativeCurrency | Token> } = {};
  for (const nc of nativeCurrencies) {
    const e = r[nc.ticker];
    if (e === undefined) r[nc.ticker] = [nc];
    else e.push(nc);
  }
  for (const t of tokens) {
    const e = r[t.ticker];
    if (e === undefined) r[t.ticker] = [t];
    else e.push(t);
  }
  return r;
})();

// allTokenTickers is the set of all token tickers we support
export const allTokenTickers = Object.keys(tokensByTicker);

// getTokenByTokenKey returns a NativeCurrency or Token for the passed
// TokenKey. For convenience, getTokenByTokenKey is a partial function
// that throws an error if the passed TokenKey is not found in the
// global cache. Alternatively, getTokenByTokenKey could have returned
// `NativeCurrency | Token | undefined` which would be less
// convenient.
export function getTokenByTokenKey(tk: TokenKey): NativeCurrency | Token {
  const t = tokensByTokenKey[tk];
  if (t === undefined) throw new Error(`getTokenByTokenKey: unknown TokenKey: ${tk}`);
  return t;
}

// isToken is a TypeScript type assertion helper function to match
// `NativeCurrency | Token` into `Token` or `NativeCurrency`
export function isToken(o: NativeCurrency | Token): o is Token {
  return Object.prototype.hasOwnProperty.call(o, "address");
}

// getDecimalsToRenderForTokenTicker returns the canonical number of
// digits after the decimal point to render for a token based on its
// passed ticker.
export function getDecimalsToRenderForTokenTicker(ticker: string): number {
  switch (ticker) {
    case 'ETH': return 4;
    case 'DAI': return 2;
    case 'USDC': return 2;
    case 'USDT': return 2;
  }
  return 2;
}
