import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";

// TODO replace WalletButton with RainbowKit. This first requires rewriting our usedappConfig to instead use wagmi's chain management. When adopting rainbowkit, we may have two options, 1) drop usedapp entirely and switch to wagmi when we add rainbowkit, 2) run usedapp side-by-side wagmi with some kind of dual config/compatability between them

export function WalletButton() {
  const [rendered, setRendered] = useState("");

  // TODO there is a "bug" in useLookAddress, or maybe a feature depending on your perspective, where it attempts to look up the ENS address using the wallet's active network. This means that if your address has a primary ENS name set on mainnet, it won't be properly detected and loaded unless your wallet network is set to mainnet. But we want to make an app that always works the same way regardless of which network your wallet is connected to --> implement our own useEnsAddress(address) hook which always looks up the reverse address on mainnet if isProduction, and if !isProduction always look up reverse address on some canonical testnet implementation of ENS (it looks like ENS is deployed on Ropsten, Rinkeby and Goerli https://docs.ens.domains/ens-deployments)
  const ens = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <button className="text-1xl font-bold border-2 border-black"
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </button>
  );
}
