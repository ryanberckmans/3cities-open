import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { abis, addresses } from "@3cities/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import { Body, Container, Header } from "./components";
import logo from "./ethereumLogo.png";
import GET_TRANSFERS from "./graphql/subgraph";

function WalletButton() {
  const [rendered, setRendered] = useState("");

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
    <button className="text-3xl font-bold underline border-4 border-dotted border-black"
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

function App() {
  // Read more about useDapp on https://usedapp.io/
  const { error: contractCallError, value: tokenBalance } =
    useCall({
      contract: new Contract(addresses.ceaErc20, abis.erc20),
      method: "balanceOf",
      args: ["0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"],
    }) ?? {};
  console.log(contractCallError, tokenBalance);

  const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  useEffect(() => {
    if (subgraphQueryError) {
      console.error("Error while querying subgraph:", subgraphQueryError.message);
      return;
    }
    if (!loading && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, subgraphQueryError, data]);

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <img src={logo} alt="ethereum-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        <a href="https://reactjs.org">
          Learn React
        </a>
        <a href="https://usedapp.io/">Learn useDapp</a>
        <a href="https://thegraph.com/docs/quick-start">Learn The Graph</a>
      </Body>
    </Container>
  );
}

export default App;
