import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { NativeCurrency, Token, useEtherBalance, useTokenBalance } from "@usedapp/core";
import React from "react";
import { getChainName } from "./getChainName";
import { isToken } from "./usedappCurrencies";

type RenderProps = {
  balance: BigNumber | undefined;
  ticker: string;
  chainName: string;
}
const Render: React.FC<RenderProps> = ({ balance, ticker, chainName }) => {
  return <span>{balance ? formatEther(balance) : '?'} {ticker} on {chainName}</span>;
}

type NativeCurrencyBalanceProps = {
  nativeCurrency: NativeCurrency;
  address: string;
};
const NativeCurrencyBalance: React.FC<NativeCurrencyBalanceProps> = ({ nativeCurrency, address }) => {
  const b = useEtherBalance(address, { chainId: nativeCurrency.chainId });
  return <Render balance={b} ticker={nativeCurrency.ticker} chainName={getChainName(nativeCurrency.chainId)} />;
}


type TokenBalanceProps = {
  token: Token;
  address: string;
};
const TokenBalance: React.FC<TokenBalanceProps> = ({ token, address }) => {
  const b = useTokenBalance(token.address, address, { chainId: token.chainId });
  console.log("useTokenBalance", token, address, b);
  return <Render balance={b} ticker={token.ticker} chainName={getChainName(token.chainId)
  } />;
}

// TODO s/Wrapper/TokenBalance/ and rename the other TokenBalance to InternalTokenBalance or something
type WrapperProps = {
  nativeCurrencyOrToken: NativeCurrency | Token; // native currency or token whose address balance will be fetched and rendered. TODO maybe aggregate NativeCurrency/Token into a wrapper type 3cities.Token
  address: string; // address whose token balance will be loaded and rendered
};
const Wrapper: React.FC<WrapperProps> = ({ nativeCurrencyOrToken, address }) => {
  return isToken(nativeCurrencyOrToken) ?
    <TokenBalance token={nativeCurrencyOrToken} address={address} /> :
    <NativeCurrencyBalance nativeCurrency={nativeCurrencyOrToken} address={address} />;
}

export default Wrapper;
