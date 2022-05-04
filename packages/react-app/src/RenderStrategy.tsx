import { formatUnits } from "@ethersproject/units";
import React from "react";
import { formatFloat } from "./formatFloat";
import { getChainName } from "./getChainName";
import { ProposedStrategy } from "./strategies";
import { getDecimalsToRenderForTokenTicker } from "./tokens";

type RenderProposedStrategyProps = {
  ps: ProposedStrategy;
}

// RenderProposedStrategy is a referentially transparent componet to
// render the passed proposed strategy.
export const RenderProposedStrategy: React.FC<RenderProposedStrategyProps> = ({ ps }) => {
  const t = ps.receiverProposedTokenTransfer.token;
  return <span>Pay {formatFloat(formatUnits(ps.receiverProposedTokenTransfer.amountAsBigNumberHexString, t.decimals), getDecimalsToRenderForTokenTicker(t.ticker))} {t.ticker} on {getChainName(t.chainId)
  }</span>
}
