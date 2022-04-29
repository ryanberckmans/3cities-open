import { BigNumber } from '@ethersproject/bignumber';
import { NativeCurrency, Token, useEtherBalance, useTokenBalance } from '@usedapp/core';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { AddressContext, TokenBalance } from './addressContext';
import useAddressOrENS from './hooks/useAddressOrENS';
import { makeObservableValue, ObservableValue, Observer } from './observer';
import { getTokenKey, nativeCurrencies, tokens } from './usedappCurrencies';

const ConnectedWalletAddressContextObserverContext = React.createContext<Observer<AddressContext | undefined> | undefined>(undefined);

type NativeCurrencyBalanceUpdaterProps = {
  nativeCurrency: NativeCurrency; // nativeCurrency whose balance we'll update
  address: string; // address whose native currency balance we'll update
  updateNativeCurrencyBalance: (nc: NativeCurrency, b: BigNumber | undefined) => void; // callback we must call when native currency balance updates
}
const NativeCurrencyBalanceUpdater: React.FC<NativeCurrencyBalanceUpdaterProps> = ({ nativeCurrency, address, updateNativeCurrencyBalance }) => {
  const bRaw = useEtherBalance(address, { chainId: nativeCurrency.chainId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const b = useMemo(() => bRaw, [bRaw && bRaw._hex]); // there's a performance bug in useDapp where their hook useEtherBalance delegates to useCall which delegates to useCalls which makes use of useMemo on call results as a general solution to avoid triggering re-renders https://github.com/TrueFiEng/useDApp/blob/40c1d86d2516a948fc88bf52ceed457dac22345a/packages/core/src/hooks/useCall.ts#L52, however, two BigNumbers for the same value fail this memoization check because they are different BigNumber objects, and this causes useEtherBalance to trigger re-renders every new block because the BigNumber object instance has changed even if the balance has not changed. To fix this performance bug of triggering an unnecessary re-render every new block even when balance doesn't change, we memoize the BigNumber by its hex representation. With this fix, our downstream AddressContext will only update when the balance changes and not on every new block. Another way to fix this performance bug may be to not useMemo the balance BigNumber here, and instead always pass it to the updateTokenBalance callback and compare the new BigNumber's value with the current BigNumber's value in the TokenBalance. But, since this is effectively a performance bug within useEtherBalance, I prefer to fix it as close to the useEtherBalance callsite as possible, which is what we're doing here with useMemo
  useEffect(() => {
    updateNativeCurrencyBalance(nativeCurrency, b);
  }, [nativeCurrency, address, updateNativeCurrencyBalance, b]);
  return <></>; // nothing to render, this component only maintains state
}

type TokenBalanceUpdaterProps = {
  token: Token; // token whose balance we'll update
  address: string; // address whose token balance we'll update
  updateTokenBalance: (t: Token, b: BigNumber | undefined) => void; // callback we must call when token balance updates
}
const TokenBalanceUpdater: React.FC<TokenBalanceUpdaterProps> = ({ token, address, updateTokenBalance }) => {
  const bRaw = useTokenBalance(token.address, address, { chainId: token.chainId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const b = useMemo(() => bRaw, [bRaw && bRaw._hex]); // there's a performance bug in useDapp where their hook useTokenBalance delegates to useCall which delegates to useCalls which makes use of useMemo on call results as a general solution to avoid triggering re-renders https://github.com/TrueFiEng/useDApp/blob/40c1d86d2516a948fc88bf52ceed457dac22345a/packages/core/src/hooks/useCall.ts#L52, however, two BigNumbers for the same value fail this memoization check because they are different BigNumber objects, and this causes useTokenBalance to trigger re-renders every new block because the BigNumber object instance has changed even if the balance has not changed. To fix this performance bug of triggering an unnecessary re-render every new block even when balance doesn't change, we memoize the BigNumber by its hex representation. With this fix, our downstream AddressContext will only update when the balance changes and not on every new block. Another way to fix this performance bug may be to not useMemo the balance BigNumber here, and instead always pass it to the updateTokenBalance callback and compare the new BigNumber's value with the current BigNumber's value in the TokenBalance. But, since this is effectively a performance bug within useTokenBalance, I prefer to fix it as close to the useTokenBalance callsite as possible, which is what we're doing here with useMemo
  useEffect(() => {
    updateTokenBalance(token, b);
  }, [token, address, updateTokenBalance, b]);
  return <></>; // nothing to render, this component only maintains state
}

type ConnectedWalletAddressContextUpdaterInnerProps = {
  ov: ObservableValue<AddressContext | undefined>;
  connectedWalletAddress: string;
}
const ConnectedWalletAddressContextUpdaterInner: React.FC<ConnectedWalletAddressContextUpdaterInnerProps> = ({ ov, connectedWalletAddress }) => {
  const [ac, setAC] = useImmer<AddressContext>({ // ie. here we initialize an empty AddressContext for the currently connected wallet because no token balances have been loaded yet. The TokenBalanceUpdaters/NativeCurrencyUpdaters will be mounted below, and they will be responsible for executing callbacks to trigger updates of individual TokenBalances
    address: connectedWalletAddress,
    tokenBalances: {},
  });

  useEffect(() => {
    // if connectedWalletAddress or other dependencies change, we need to reset the AddressContext to an empty value to avoid retaining a stale AdddressContext from the previous connected wallet address
    setAC({
      address: connectedWalletAddress,
      tokenBalances: {},
    });
  }, [ov, setAC, connectedWalletAddress]);

  useEffect(() => {
    // here we actually notify observers when AddressContext has changed
    console.log("setValueAndNotifyObservers(AddressContext)", ac);
    ov.setValueAndNotifyObservers(ac);
  }, [ov, ac]);

  const updateNativeCurrencyOrTokenBalance = useCallback((nativeCurrencyOrToken: NativeCurrency | Token, newBalance: BigNumber | undefined) => { // updateNativeCurrencyOrTokenBalance is a single callback to be shared among all NativeCurrencyUpdaters/TokenBalanceUpdaters because each updater passes its own NativeCurrency/Token to this callback to be mapped into a tokenKey to then update AddressContext. Alternatively, we could have baked/curried the NativeCurrency/Token into the callback and created N callbacks, one per token
    setAC(draft => {
      const tk = getTokenKey(nativeCurrencyOrToken);
      if (newBalance === undefined) delete draft.tokenBalances[tk];
      else {
        const tb: TokenBalance = {
          address: connectedWalletAddress,
          tokenKey: tk,
          balance: newBalance,
          balanceAsOf: new Date().getTime(),
        };
        console.log("updateNativeCurrencyOrTokenBalance callback", tb);
        draft.tokenBalances[tk] = tb;
      }
    });
  }, [connectedWalletAddress, setAC]);

  return <>
    {tokens.map(t => <TokenBalanceUpdater
      key={getTokenKey(t)}
      token={t}
      address={connectedWalletAddress}
      updateTokenBalance={updateNativeCurrencyOrTokenBalance}
    />)}
    {nativeCurrencies.map(nc => <NativeCurrencyBalanceUpdater
      key={getTokenKey(nc)}
      nativeCurrency={nc}
      address={connectedWalletAddress}
      updateNativeCurrencyBalance={updateNativeCurrencyOrTokenBalance}
    />)}
  </>;
};

type ConnectedWalletAddressContextUpdaterProps = {
  ov: ObservableValue<AddressContext | undefined>;
}
const ConnectedWalletAddressContextUpdater: React.FC<ConnectedWalletAddressContextUpdaterProps> = ({ ov }) => {
  const connectedWalletAddress = useAddressOrENS();
  useEffect(() => {
    if (connectedWalletAddress === undefined) { // here we only need to setValueAndNotifyObservers if connectedWalletAddress is undefined because if it's defined, we'll construct the AddressContext and call setValueAndNotifyObservers(defined value) in ConnectedWalletAddressContextUpdaterInner, and if connectedWalletAddress has transitioned from defined to undefined, the ConnectedWalletAddressContextUpdaterInner component has been unmounted and it won't (and isn't designed to) call setValueAndNotifyObservers(undefined) to notify clients that the wallet has become disconnected, so we need to do it here
      console.log("setValueAndNotifyObservers(AddressContext=undefined)");
      ov.setValueAndNotifyObservers(undefined);
    }
  }, [ov, connectedWalletAddress]);
  return connectedWalletAddress === undefined ? <></> : <ConnectedWalletAddressContextUpdaterInner ov={ov} connectedWalletAddress={connectedWalletAddress} />;
};

type ConnectedWalletAddressContextObserverProviderProps = {
  children?: React.ReactNode;
}

export const ConnectedWalletAddressContextObserverProvider: React.FC<ConnectedWalletAddressContextObserverProviderProps> = ({ children }) => {
  const [ov] = useState(() => makeObservableValue<AddressContext | undefined>(undefined));
  return <ConnectedWalletAddressContextObserverContext.Provider value={ov.observer}>
    <ConnectedWalletAddressContextUpdater ov={ov} />
    {children}
  </ConnectedWalletAddressContextObserverContext.Provider>;
};

export function useConnectedWalletAddressContext(): AddressContext | undefined {
  const o: Observer<AddressContext | undefined> | undefined = useContext(ConnectedWalletAddressContextObserverContext);
  // here we inline the approximate contents of our useObservedValue hook. We inline because we need to include an additional check for if `o === undefined` which occurs if this hook is used in a component that isn't a descendant of ConnectedWalletAddressContextObserverProvider
  const [ac, setAC] = useState(() => {
    if (o === undefined) return undefined;
    return o.getCurrentValue();
  });
  useEffect(() => {
    if (o === undefined) return;
    setAC(o.getCurrentValue()); // WARNING here we explicitly set ac to the current value because if we don't then it'll be stale because it won't otherwise be updated until the next setValueAndNotifyObservers. Ie. if `o` was undefined and becomes defined, that'll trigger `o.subscribe(setAC)` but `ac` is undefined, so there must be a step to set `ac` to the current value as of when `o` becomes defined, which is what we're doing on this line
    return o.subscribe(setAC).unsubscribe;
  }, [o, setAC]);

  return ac;
}
