import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import useClipboard from "react-use-clipboard";
import { Checkout } from "./checkout";
import { CheckoutEditor } from "./CheckoutEditor";
import { Body, Container, Header } from "./components";
import { serializeToModifiedBase64 } from "./serialize";

// import { useConnectedWalletAddressContext } from "./connectedWalletContextProvider";

// Old imports:
// import { abis, addresses } from "@3cities/contracts";
// import { useQuery } from "@apollo/client";
// import { Contract } from "@ethersproject/contracts";
// import { formatEther } from '@ethersproject/units';
// import { shortenAddress, useCall, useEtherBalance, useEthers, useLookupAddress, useTokenBalance } from "@usedapp/core";
// import React, { useEffect, useState } from "react";
// import { Body, Container, Header } from "./components";
// import GET_TRANSFERS from "./graphql/subgraph";
// import useAddressOrENS from "./hooks/useAddressOrENS";
// import { nativeCurrencies, tokens } from "./usedappCurrencies";
// import TokenBalance from "./TokenBalance";
// import { useConnectedWalletAddressContext } from "./connectedWalletContextProvider";

function WalletButton() {
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

// const Leaf: React.FC = () => {
//   const ac = useConnectedWalletAddressContext();
//   // console.log("Leaf render", ac);
//   let tokensRendered = 0;
//   if (ac === undefined) return null;
//   else return <div>
//     connected address: {ac.address}<br />
//     {allTokenKeys.map(tk => {
//       const tb = ac.tokenBalances[tk];
//       if (tb === undefined) return;
//       else {
//         tokensRendered += 1;
//         return <div key={tk}>
//           <RenderTokenBalance tokenBalance={tb} />
//         </div>;
//       }
//     })}
//     {tokensRendered < 1 && "(no token balances)"}
//   </div>;
// }

// const Intermediate: React.FC = () => {
// const [num, setNum] = useState(0);
// useEffect(() => {
//   const intervalId = setInterval(() => {
//     setNum(n => n + 1);
//   }, 10000);
//   return () => clearInterval(intervalId);
// }, [setNum]);
// console.log("Intermediate render", num);
// return <div>
// {/*num % 2 === 0 &&*/ <Leaf /> /* here we flicker Leaf in and out of existence to test subscription clearing on unmount */}
// </div>;
// }

// const testCheckout: Checkout = {
//   proposedAgreement: {
//     toAddress: '0xac0d7753EA2816501b57fae9ad665739018384b3',
//     logicalAssetTicker: 'USD',
//     amountAsBigNumberHexString: parseLogicalAssetAmount("30.12").toHexString(),
//     _p: false,
//     _rpp: true,
//   },
//   strategyPreferences: {
//     tokenTickerExclusions: ['USDC'],
//     chainIdExclusions: [42],
//   },
// };

// function ProposedStrategyTest() {
//   const pss = getProposedStrategiesForProposedAgreement(testCheckout.strategyPreferences, testCheckout.proposedAgreement);
//   if (pss.length < 1) return <div>(no proposed strategies)</div>;
//   else return <div>
//     proposed strategies:
//     {pss.map(ps => <div key={getTokenKey(ps.receiverProposedTokenTransfer.token)}><RenderProposedStrategy ps={ps} /></div>)}
//   </div >;
// }

// function StrategyTest() {
//   const ac = useConnectedWalletAddressContext();
//   if (ac === undefined) return <div>no strategies because no wallet is connected</div>;
//   else if (isReceiverProposedPayment(testCheckout.proposedAgreement)) {
//     const ss = getStrategiesForAgreement(testCheckout.strategyPreferences, acceptReceiverProposedPayment(ac.address, testCheckout.proposedAgreement), ac);
//     if (ss.length < 1) return <div>(no strategies)</div>;
//     else return <div>
//       strategies:
//       {ss.map(s => <div key={getTokenKey(s.tokenTransfer.token)}>
//         <RenderStrategy s={s} />
//       </div>)}
//     </div >;
//   } else return <div>strategy test: unsupported agreement type</div>;
// }

function App() {
  // const maybeAddressOrENS = useAddressOrENS();
  // const firstNativeCurrencyBalance = useEtherBalance(maybeAddressOrENS, { chainId: nativeCurrencies[0].chainId });
  // const firstTokenBalance = useTokenBalance(tokens[0].address, maybeAddressOrENS, { chainId: tokens[0].chainId });
  // console.log('addr', maybeAddressOrENS, 'firstTokenBalance', firstTokenBalance);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const ftb = useMemo(() => firstTokenBalance, [firstTokenBalance && firstTokenBalance.toString()]);

  // Read more about useDapp on https://usedapp.io/
  // const { error: contractCallError, value: tokenBalance } =
  //   useCall({
  //     contract: new Contract(addresses.ceaErc20, abis.erc20),
  //     method: "balanceOf",
  //     args: ["0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"],
  //   }) ?? {};
  // console.log(contractCallError, tokenBalance);

  // const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  // useEffect(() => {
  //   if (subgraphQueryError) {
  //     console.error("Error while querying subgraph:", subgraphQueryError.message);
  //     return;
  //   }
  //   if (!loading && data && data.transfers) {
  //     console.log({ transfers: data.transfers });
  //   }
  // }, [loading, subgraphQueryError, data]);

  // const STAKING_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
  // const stakingBalance = useEtherBalance(STAKING_CONTRACT);
  // console.log('stakingBalance', stakingBalance && formatEther(stakingBalance));

  const [checkout, setCheckout] = useState<Checkout | undefined>(undefined);
  const [checkoutLink, setCheckoutLink] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (checkout !== undefined) setCheckoutLink(`${location.origin}/#/pay?c=${serializeToModifiedBase64(checkout)}`); // TODO use current domain to build a relative checkout link; react-router may provide utils for this
  }, [checkout, setCheckoutLink]);

  const [isCopied, setCopied] = useClipboard(checkoutLink || '', {
    successDuration: 5000, // `isCopied` will go back to `false` after 5000ms
  });

  return (
    <Container>
      <Header>
        <span className="font-bold">3cities&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <WalletButton />
        {/* {ftb && <><br />first token balance: {formatEther(ftb)}</>} */}
        {/* {maybeAddressOrENS && <><br />connected: {maybeAddressOrENS}</>}
        {firstNativeCurrencyBalance && <><br />first native currency balance: {formatEther(firstNativeCurrencyBalance)}</>}
        {firstTokenBalance && <><br />first token balance: {formatEther(firstTokenBalance)}</>}
        {maybeAddressOrENS && nativeCurrencies.map(nc => <div key={`${nc.ticker} ${nc.chainId}`}>
          <TokenBalance nativeCurrencyOrToken={nc} address={maybeAddressOrENS} key={`${nc.ticker} ${nc.chainId}`} />
        </div>)}
        {maybeAddressOrENS && tokens.map(nc => <div key={`${nc.ticker} ${nc.chainId}`}>
          <TokenBalance nativeCurrencyOrToken={nc} address={maybeAddressOrENS} key={`${nc.ticker} ${nc.chainId}`} />
        </div>)} */}
      </Header>
      <Body>
        {checkout === undefined && <CheckoutEditor setResult={setCheckout} />}
        {checkoutLink !== undefined && <div>
          <br /><span className="font-bold">Share this link to request money:</span>
          <br /><br /><br /><br />
          <div className="flex justify-center">
            <div>
              {navigator.share !== undefined ? <button className="text-4xl font-bold border-2 border-black" onClick={() => {
                navigator.share({ url: checkoutLink })
              }}>
                Share Link
              </button> : <span><button className="text-4xl font-bold border-2 border-black" onClick={setCopied}>
                Copy Link
              </button><br />{isCopied && ' copied'} </span>}
            </div>
          </div>
        </div>}
      </Body>
    </Container>
  );
}

export default App;
