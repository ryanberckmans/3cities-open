import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { acceptReceiverProposedPayment, isReceiverProposedPayment, ReceiverProposedPayment } from "./agreements";
import { Checkout } from "./checkout";
import { Body, Container, Header } from "./components";
import { useConnectedWalletAddressContext } from "./connectedWalletContextProvider";
import { getChainName } from "./getChainName";
import { RenderLogicalAssetAmount } from "./RenderLogicalAssetAmount";
import { RenderStrategy } from "./RenderStrategy";
import { deserializeFromModifiedBase64 } from "./serialize";
import { getProposedStrategiesForProposedAgreement, getStrategiesForAgreement } from "./strategies";
import { getTokenKey } from "./tokens";
import { ExecuteTokenTransferButton } from "./transactions";
import { WalletButton } from "./WalletButton";

export const Pay: React.FC = () => {
  const [checkout, setCheckout] = useState<Checkout | undefined>(undefined);

  useEffect(() => {
    const hack = location.hash.substring(location.hash.indexOf('?') + 1); // WARNING HACK TODO here we hardcode queryparam parsing when instead we should use, say, react-router's query param utils
    const q = new URLSearchParams(hack);
    const s = q.get("c");
    if (s !== null) try {
      setCheckout(deserializeFromModifiedBase64(s));
    } catch (e) {
      console.warn(e);
    }
  }, [setCheckout]);

  const ac = useConnectedWalletAddressContext();

  return (
    <Container>
      <Header>
        <Link to="/">
          <span className="font-bold">3cities&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </Link>
        <WalletButton />
      </Header>
      <Body>
        <div className="flex justify-center">
          {checkout === undefined && <div>Invalid link</div>}
          {checkout !== undefined && ac === undefined && isReceiverProposedPayment(checkout.proposedAgreement) && <div>
            <br />
            {(() => {
              const pss = getProposedStrategiesForProposedAgreement(checkout.strategyPreferences, checkout.proposedAgreement);
              const rpp: ReceiverProposedPayment = checkout.proposedAgreement;
              const allStrategiesTokenTickers: string[] = [... new Set(pss.map(ps => ps.receiverProposedTokenTransfer.token.ticker))];
              const allStrategiesChainIds: number[] = [... new Set(pss.map(ps => ps.receiverProposedTokenTransfer.token.chainId))];
              return <span className="font-bold">Pay <RenderLogicalAssetAmount {...rpp} />{rpp.note && ` for ${rpp.note}`}
                <br /><br />Tokens Accepted: {allStrategiesTokenTickers.join(", ")}
                <br /><br />Chains Accepted: {allStrategiesChainIds.map(getChainName).join(", ")}

              </span>;
            })()}
            <br />
            <br />
            Connect wallet to pay
          </div>}
          {checkout !== undefined && ac !== undefined && isReceiverProposedPayment(checkout.proposedAgreement) && <div>
            <br />
            <span className="font-bold">You&apos;re about to pay <RenderLogicalAssetAmount {...checkout.proposedAgreement} />{checkout.proposedAgreement.note && ` for ${checkout.proposedAgreement.note}`}</span>
            <br />
            <br />
            <span className="font-bold">Your payment options:</span>
            {(() => {
              const ss = getStrategiesForAgreement(checkout.strategyPreferences, acceptReceiverProposedPayment(ac.address, checkout.proposedAgreement), ac);
              if (ss.length < 1) return <div>
                <br />No payment options for the connected wallet.
                <br />Please disconnect your wallet to see the available tokens and chains. </div>;
              else return ss.map(s => <div key={getTokenKey(s.tokenTransfer.token)}>
                <br />
                <RenderStrategy s={s} />
                &nbsp;
                <ExecuteTokenTransferButton tt={s.tokenTransfer}/>
              </div>);
            })()}
          </div>}
        </div>
      </Body>
    </Container>
  );
} 
