import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import React from "react";

type RenderRawTokenBalance = {
  balance: BigNumber | undefined;
  ticker: string;
  chainName: string;
}
export const RenderRawTokenBalance: React.FC<RenderRawTokenBalance> = ({ balance, ticker, chainName }) => {
  return <span>{balance ? formatEther(balance) : '?'} {ticker} on {chainName}</span>;
}
