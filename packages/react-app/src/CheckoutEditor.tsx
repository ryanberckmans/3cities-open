import { useEthers } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import { ReceiverProposedPayment } from "./agreements";
import { Checkout } from './checkout';
import { LogicalAssetTicker, parseLogicalAssetAmount } from "./logicalAssets";
import { StrategyPreferences } from "./strategies";

// Here we implement a synthetic router to build a Checkout in a
// series of small UI steps. These steps are currently hardcoded to
// build a Checkout where the Agreement is a ReceivedProposedPayment.

type CheckoutStep1Result = Pick<ReceiverProposedPayment, 'logicalAssetTicker' | 'amountAsBigNumberHexString' | 'note'>

export const CheckoutStep1: React.FC<{ setResult: (r: CheckoutStep1Result) => void }> = ({ setResult }) => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [note, setNote] = useState<string | undefined>(undefined);

  return <div>
    <br /><span className="font-bold">Request Money</span>
    <br /><br /><label className="font-bold" htmlFor="amount">Amount: $&nbsp;</label>
    <input id="amount" type="number" placeholder={"how much?"} onChange={(e) => {
      try {
        const v = parseFloat(e.target.value);
        if (v > 0) setAmount(v);
        else setAmount(undefined);
      } catch (err) {
        console.warn(err);
      }
    }} value={amount}></input>
    <br /><br /><label className="font-bold" htmlFor="note">For what?&nbsp;</label>
    <input id="note" type="text" placeholder={"(optional)"} onChange={(e) => {
      if (e.target.value.length > 0) setNote(e.target.value);
      else setNote(undefined);
    }} value={note}></input>
    <br /><br /><button className={`text-1xl font-bold border-2 ${amount !== undefined ? 'border-black' : 'border-grey-600 font-extralight'}`} onClick={() => {
      if (amount !== undefined) {
        const p = {
          logicalAssetTicker: 'USD' as LogicalAssetTicker, // TODO support ETH
          amountAsBigNumberHexString: parseLogicalAssetAmount(amount.toString()).toHexString(),
        };
        setResult(note === undefined ? p : Object.assign({ note }, p));
      }
    }} disabled={amount === undefined}>Request</button>
  </div>
}

type CheckoutStep2Result = StrategyPreferences

export const CheckoutStep2: React.FC<{ setResult: (r: CheckoutStep2Result) => void }> = ({ setResult }) => {
  return <div>
    TODO Strategy Preferences Editor
    <br /><br /><button className="text-1xl font-bold border-2 border-black" onClick={() => setResult({})}>Use Default Strategy Preferences</button>
  </div>;
}

type CheckoutStep3Result = string // ie. Payment.toAddress

export const CheckoutStep3: React.FC<{ setResult: (r: CheckoutStep3Result) => void }> = ({ setResult }) => {
  // TODO AddressPicker reusable component that lets you type in an address, ENS, or connect wallet to provide one
  const { account } = useEthers();
  const [address, setAddress] = useState<string | undefined>(typeof account === 'string' ? account : undefined);

  useEffect(() => {
    if (address === undefined && typeof account === 'string') setAddress(account);
  }, [account, address, setAddress])

  return <div>
    <label htmlFor="address">Address to receive money (no ENS yet):</label>
    <br /><input style={{ width: '100%' }} id="address" type="text" placeholder={"0x123... or connect wallet"} onChange={(e) => {
      if (e.target.value.length > 0) setAddress(e.target.value);
      else setAddress(undefined);
    }} value={address}></input>
    <br /><br /><button className={`text-1xl font-bold border-2 ${address !== undefined ? 'border-black' : 'border-grey-600 font-extralight'}`} disabled={address === undefined} onClick={() => { if (address !== undefined) /* TODO address validation, ensure it's at least a well-formed addressed, ENS resolves, etc. */ setResult(address) }}>Done</button>
  </div>;
}

export const CheckoutEditor: React.FC<{ setResult: (r: Checkout) => void }> = ({ setResult }) => {
  const [checkoutStep1Result, setCheckoutStep1Result] = useState<CheckoutStep1Result | undefined>(undefined);
  const [checkoutStep2Result, setCheckoutStep2Result] = useState<CheckoutStep2Result | undefined>(undefined);
  const [checkoutStep3Result, setCheckoutStep3Result] = useState<CheckoutStep3Result | undefined>(undefined);
  const render = (() => {
    if (checkoutStep1Result === undefined) return <CheckoutStep1 setResult={setCheckoutStep1Result} />;
    else if (checkoutStep2Result === undefined) return <CheckoutStep2 setResult={setCheckoutStep2Result} />;
    else if (checkoutStep3Result === undefined) return <CheckoutStep3 setResult={setCheckoutStep3Result} />
    else {
      const rpp: ReceiverProposedPayment = Object.assign({
        toAddress: checkoutStep3Result,
        _p: false as const,
        _rpp: true as const,
      }, checkoutStep1Result);
      const c: Checkout = {
        proposedAgreement: rpp,
        strategyPreferences: checkoutStep2Result,
      };
      setResult(c);
      return <span>Done</span>
    }
  })();
  return <div>
    {render}
  </div>;
};
