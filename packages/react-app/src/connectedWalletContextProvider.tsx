import React, { useContext, useEffect, useState } from 'react';
import useAddressOrENS from './hooks/useAddressOrENS';
import { makeObservableValue, ObservableValue, Observer } from './observer';

// TODO maybe move AddressContext to its own file
// TODO maybe make AddressContext an immutable value, eg. using immer https://github.com/immerjs/immer
interface AddressContext {
  address: string;
  tempTokenBalance?: number; // TODO replace with actual token balances
}

const ConnectedWalletAddressContextObserverContext = React.createContext<Observer<AddressContext | undefined> | undefined>(undefined);

type ConnectedWalletAddressContextUpdaterProps = {
  ov: ObservableValue<AddressContext | undefined>;
}
const ConnectedWalletAddressContextUpdater: React.FC<ConnectedWalletAddressContextUpdaterProps> = ({ ov }) => {
  const connectedWalletAddressOrENS = useAddressOrENS();
  // TODO construct and maintain the AddressContext. This is where we subscribe to token balance updates and push each new AddressContext. We should debounce the pushes somehow so that AddressContext is only flushed to observers every N milliseconds --> idea: hooks can't be called conditionally or in callbacks, but, given that our global set of tokens is static at runtime, we might be able to assemble a list of useStates like `tokenBalances = []; setTokenBalances = []; i = 0; for (const t of tokens) { const [t, st] = useTokenBalance(...); ...; i += 1;}; ... and then re-run the AddressContext useEffect any time any of them changes, with that debounce, and construct the next AddressContext based on the change. Or maybe N useEffects, one per each N useTokenBalance, so that we're only updating the token balance that changed`
  useEffect(() => {
    if (connectedWalletAddressOrENS === undefined) {
      ov.setValueAndNotifyObservers(undefined);
    } else {
      const ac: AddressContext = {
        address: connectedWalletAddressOrENS,
        tempTokenBalance: 5, // TODO real
      }
      ov.setValueAndNotifyObservers(ac);
    }
  }, [ov, connectedWalletAddressOrENS]);
  return <></>; // nothing to render, this component only maintains state
};

type ConnectedWalletAddressContextObserverProviderProps = {
  children?: React.ReactNode;
}

export const ConnectedWalletAddressContextObserverProvider: React.FC<ConnectedWalletAddressContextObserverProviderProps> = ({ children }) => {
  const [ov] = useState(() => makeObservableValue<AddressContext | undefined>(undefined));
  return <ConnectedWalletAddressContextObserverContext.Provider value={ov.observer}>
    <ConnectedWalletAddressContextUpdater ov={ov}/>
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
