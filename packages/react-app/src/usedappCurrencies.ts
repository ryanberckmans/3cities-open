import { Arbitrum, ArbitrumRinkeby, Dai, Ether, Kovan, KovanDai, KovanEther, Mainnet, NativeCurrency, Optimism, OptimismKovan, Token } from "@usedapp/core";
import { isProduction } from "./isProduction";

// WARNING currencies defined here won't actually work at runtime unless an rpc url is defined for their chainId in the loaded @useDapp/core.Config.

const USDC = new Token('USD Coin', 'USDC', Mainnet.chainId, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
const KovanUSDC = new Token('USD Coin', 'USDC', Kovan.chainId, '0x50dC5200082d37d5dd34B4b0691f36e3632fE1A8');

const OptimismEther = new NativeCurrency('Ether', 'ETH', Optimism.chainId);
const OptimismKovanEther = new NativeCurrency('Ether', 'ETH', OptimismKovan.chainId);
const OptimismDai = new Token('Dai', 'DAI', Optimism.chainId, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1');
const OptimismKovanDai = new Token('Dai', 'DAI', OptimismKovan.chainId, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1');
const OptimismUSDC = new Token('USD Coin', 'USDC', Optimism.chainId, '0x7F5c764cBc14f9669B88837ca1490cCa17c31607');
const OptimismKovanUSDC = new Token('USD Coin', 'USDC', OptimismKovan.chainId, '0x4e62882864fB8CE54AFfcAf8D899A286762B011B');

const ArbitrumEther = new NativeCurrency('Ether', 'ETH', Arbitrum.chainId);
const ArbitrumRinkebyEther = new NativeCurrency('Ether', 'ETH', ArbitrumRinkeby.chainId);
const ArbitrumDai = new Token('Dai', 'DAI', Arbitrum.chainId, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1');
const ArbitrumRinkebyDai = new Token('Dai', 'DAI', ArbitrumRinkeby.chainId, '0x2f3c1b6a51a469051a22986aa0ddf98466cc8d3c');
const ArbitrumUSDC = new Token('USD Coin', 'USDC', Arbitrum.chainId, '');
const ArbitrumRinkebyUSDC = new Token('USD Coin', 'USDC', ArbitrumRinkeby.chainId, '');

export const nativeCurrencies: [NativeCurrency, NativeCurrency, NativeCurrency] = isProduction ? [
  Ether,
  OptimismEther,
  ArbitrumEther,
] : [
  KovanEther,
  OptimismKovanEther,
  ArbitrumRinkebyEther,
];

export const tokens: [Token, Token, Token, Token, Token, Token] = isProduction ? [
  Dai,
  OptimismDai,
  ArbitrumDai,
  USDC,
  OptimismUSDC,
  ArbitrumUSDC,
] : [
  KovanDai,
  OptimismKovanDai,
  ArbitrumRinkebyDai,
  KovanUSDC,
  OptimismKovanUSDC,
  ArbitrumRinkebyUSDC,
];
