import React, { useEffect, useState } from "react";
import { acceptReceiverProposedPayment, isReceiverProposedPayment } from "./agreements";
import { Checkout } from "./checkout";
import { useConnectedWalletAddressContext } from "./connectedWalletContextProvider";
import { ContentWrapper } from "./ContentWrapper";
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

  const heading = checkout === undefined || !isReceiverProposedPayment(checkout.proposedAgreement) ? "Invalid Link" : ((checkout.proposedAgreement.note && <span>Pay <RenderLogicalAssetAmount {...checkout.proposedAgreement} /> for {checkout.proposedAgreement.note}</span>) || <span>Pay <RenderLogicalAssetAmount {...checkout.proposedAgreement} /></span>);

  return (
    <ContentWrapper heading={heading}>
      <div className="flex flex-col gap-5">
        {checkout === undefined && <div>Please ask them for a new link</div>}
        {checkout !== undefined && ac === undefined && <div>
          <br />
          {(() => {
            const pss = getProposedStrategiesForProposedAgreement(checkout.strategyPreferences, checkout.proposedAgreement);
            const allStrategiesTokenTickers: string[] = [... new Set(pss.map(ps => ps.receiverProposedTokenTransfer.token.ticker))];
            const allStrategiesChainIds: number[] = [... new Set(pss.map(ps => ps.receiverProposedTokenTransfer.token.chainId))];
            return <div className="space-y-2.5">
              <h4><span className="font-bold">Tokens Accepted:</span><br />{allStrategiesTokenTickers.join(", ")}</h4>
              <h4><span className="font-bold">Chains Accepted:</span><br />{allStrategiesChainIds.map(getChainName).join(", ")}</h4>
            </div>;
          })()}
          <br />
          <WalletButton className="inline-flex justify-start rounded-md bg-gradient-to-br from-violet-500 to-blue-500 px-3.5 py-2 text-sm font-medium text-white transition hover:hue-rotate-30 active:scale-95 active:hue-rotate-60" connectWalletText={"Connect Wallet to Pay Now"} />
        </div>}
        {checkout !== undefined && ac !== undefined && isReceiverProposedPayment(checkout.proposedAgreement) && <div>
          <span className="font-bold">Your payment options:</span>
          {(() => {
            const ss = getStrategiesForAgreement(checkout.strategyPreferences, acceptReceiverProposedPayment(ac.address, checkout.proposedAgreement), ac);
            if (ss.length < 1) return <div>
              <br />No payment options for the connected wallet.
              <br /><br />Please disconnect your wallet to see the available tokens and chains. </div>;
            else return ss.map(s => <div key={getTokenKey(s.tokenTransfer.token)}>
              <br />
              <RenderStrategy s={s} />
              &nbsp;
              <ExecuteTokenTransferButton tt={s.tokenTransfer} />
            </div>);
          })()}
        </div>}
      </div>
    </ContentWrapper>
  );
} 
