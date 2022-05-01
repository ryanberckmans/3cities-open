import { NativeCurrency, Token } from "@usedapp/core";
import React from "react";
import { getChainName } from "./getChainName";
import { useMemoEtherBalance } from "./hooks/useMemoEtherBalance";
import { useMemoTokenBalance } from "./hooks/useMemoTokenBalance";
import { RenderRawTokenBalance } from "./RenderRawTokenBalance";
import { isToken } from "./usedappCurrencies";

type RenderLiveTokenBalanceProps = {
  address: string; // address whose token balance will be live-reloaded and rendered
  nativeCurrencyOrToken: NativeCurrency | Token; // native currency or token whose address balance will be live-reloaded and rendered
};
export const RenderLiveTokenBalance: React.FC<RenderLiveTokenBalanceProps> = ({ address, nativeCurrencyOrToken }) => {
  return isToken(nativeCurrencyOrToken) ?
    <RenderLiveTokenBalanceInternal address={address} token={nativeCurrencyOrToken} /> :
    <RenderLiveNativeCurrencyBalance address={address} nativeCurrency={nativeCurrencyOrToken} />;
}

type RenderLiveNativeCurrencyBalanceProps = {
  address: string;
  nativeCurrency: NativeCurrency;
};
const RenderLiveNativeCurrencyBalance: React.FC<RenderLiveNativeCurrencyBalanceProps> = ({ address, nativeCurrency }) => {
  const b = useMemoEtherBalance(address, nativeCurrency.chainId);
  return <RenderRawTokenBalance
    balance={b}
    ticker={nativeCurrency.ticker}
    decimals={nativeCurrency.decimals}
    chainName={getChainName(nativeCurrency.chainId)}
  />;
}

type RenderLiveTokenBalanceInternalProps = {
  address: string;
  token: Token;
};
const RenderLiveTokenBalanceInternal: React.FC<RenderLiveTokenBalanceInternalProps> = ({ address, token }) => {
  const b = useMemoTokenBalance(token.address, address, token.chainId);
  return <RenderRawTokenBalance
    balance={b}
    ticker={token.ticker}
    decimals={token.decimals}
    chainName={getChainName(token.chainId)}
  />;
}
