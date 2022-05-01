import { BigNumberish } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import React from "react";

type RenderRawTokenBalanceProps = {
  balance: BigNumberish | undefined;
  ticker: string;
  chainName: string;
}
export const RenderRawTokenBalance: React.FC<RenderRawTokenBalanceProps> = ({ balance, ticker, chainName }) => {
  return <span>{balance !== undefined ? formatEther(balance) : '?'} {ticker} on {chainName}</span>;
}
