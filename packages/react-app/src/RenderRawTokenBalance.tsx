import { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import React from "react";
import { formatFloat } from "./formatFloat";
import { getDecimalsToRenderForTicker } from "./tokens";

type RenderRawTokenBalanceProps = {
  balance: BigNumberish | undefined; // token balance to render https://docs.ethers.io/v5/api/utils/bignumber/#BigNumberish
  ticker: string; // token ticker to render, eg. 'DAI' or 'ETH'
  decimals: number; // number of decimals in this token, eg. 18 for DAI or ETH, 6 for USDC or USDT
  chainName: string; // chain name on which this token's contract resides, eg. 'Optimism'
}

// RenderRawTokenBalance is a referentially transparent component that owns the definition of a canonical render of one token balance. The inputs to RenderRawTokenBalance are low-level and are expected to be used by intermediate utility components and not by end-clients.
export const RenderRawTokenBalance: React.FC<RenderRawTokenBalanceProps> = ({ balance, ticker, decimals, chainName }) => {
  return <span>{balance !== undefined ? formatFloat(formatUnits(balance, decimals), getDecimalsToRenderForTicker(ticker)) : '?'} {ticker} on {chainName}</span>;
}
