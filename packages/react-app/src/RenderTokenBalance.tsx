import React from "react";
import { getChainName } from "./getChainName";
import { RenderRawTokenBalance } from "./RenderRawTokenBalance";
import { TokenBalance } from "./tokenBalance";
import { getTokenByTokenKey } from "./usedappCurrencies";

type RenderTokenBalanceProps = {
  tokenBalance: TokenBalance;
}

// RenderTokenBalance is a referentially transparent component to
// render the passed TokenBalance.
export const RenderTokenBalance: React.FC<RenderTokenBalanceProps> = ({ tokenBalance }) => {
  const t = getTokenByTokenKey(tokenBalance.tokenKey);
  return <RenderRawTokenBalance
    balance={tokenBalance.balanceAsBigNumberHexString}
    ticker={t.ticker}
    decimals={t.decimals}
    chainName={getChainName(t.chainId)}
  />;
}
