import { useEthers } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import CurrencyInput from 'react-currency-input-field';
import { useImmer } from 'use-immer';
import { ReceiverProposedPayment } from "./agreements";
import { Checkout } from './checkout';
import { getChainName } from "./getChainName";
import { LogicalAssetTicker, parseLogicalAssetAmount } from "./logicalAssets";
import { StrategyPreferences } from "./strategies";
import { allTokenTickers } from "./tokens";
import { allChainIds } from "./usedappConfig";

// Here we implement a synthetic router to build a Checkout in a
// series of small UI steps. These steps are currently hardcoded to
// build a Checkout where the Agreement is a ReceivedProposedPayment.

type CheckoutStep1Result = Pick<ReceiverProposedPayment, 'logicalAssetTicker' | 'amountAsBigNumberHexString' | 'note'>

export const CheckoutStep1: React.FC<{ setResult: (r: CheckoutStep1Result) => void }> = ({ setResult }) => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [note, setNote] = useState<string>('');

  return <div>
    <br /><span className="font-bold">Request Money</span>
    <br /><br /><label className="font-bold" htmlFor="amount">Amount: &nbsp;</label>
    <CurrencyInput
      id="amount"
      name="amount"
      placeholder="how much?"
      prefix="$"
      allowNegativeValue={false}
      defaultValue={0}
      decimalsLimit={2}
      onValueChange={(vs) => {
        if (vs === undefined) setAmount(undefined)
        else try {
          const v = parseFloat(vs);
          if (v > 0) setAmount(v);
          else setAmount(undefined);
        } catch (err) {
          console.warn(err);
        }
      }}
    />
    <br /><br /><label className="font-bold" htmlFor="note">For what?&nbsp;</label>
    <input id="note" type="text" placeholder={"(optional)"} onChange={(e) => setNote(e.target.value)} value={note}></input>
    <br /><br /><button className={`text-1xl font-bold border-2 ${amount !== undefined ? 'border-black' : 'border-grey-600 font-extralight'}`} onClick={() => {
      if (amount !== undefined) {
        const p = {
          logicalAssetTicker: 'USD' as LogicalAssetTicker, // TODO support ETH
          amountAsBigNumberHexString: parseLogicalAssetAmount(amount.toString()).toHexString(),
        };
        setResult(note === '' ? p : Object.assign({ note }, p));
      }
    }} disabled={amount === undefined}>Request</button>
  </div>
}

type CheckoutStep2Result = StrategyPreferences

export const CheckoutStep2: React.FC<{ setResult: (r: CheckoutStep2Result) => void }> = ({ setResult }) => {
  const [sp, setSp] = useImmer<StrategyPreferences>({});

  const toggleTokenTicker = (tt: string) => {
    setSp(draft => {
      if (draft.tokenTickerExclusions === undefined) draft.tokenTickerExclusions = [tt];
      else {
        const i = draft.tokenTickerExclusions.indexOf(tt);
        if (i > -1) draft.tokenTickerExclusions.splice(i, 1);
        else draft.tokenTickerExclusions.push(tt);
      }
    });
  }

  const toggleChainId = (cid: number) => {
    setSp(draft => {
      if (draft.chainIdExclusions === undefined) draft.chainIdExclusions = [cid];
      else {
        const i = draft.chainIdExclusions.indexOf(cid);
        if (i > -1) draft.chainIdExclusions.splice(i, 1);
        else draft.chainIdExclusions.push(cid);
      }
    });
  }

  // TODO delegate to StrategyPreferencesEditor
  return <div>
    <br /><span className="font-bold">Accepting these tokens:</span>
    {allTokenTickers.map(tt => <div key={tt}><button style={{ minWidth: '12em', marginTop: '0.61em' }} className="font-bold border-2 border-black" onClick={toggleTokenTicker.bind(null, tt)}>{sp.tokenTickerExclusions !== undefined && sp.tokenTickerExclusions.indexOf(tt) > -1 && 'no '}{tt}</button></div>)}

    <br /><span className="font-bold">On these chains:</span>
    {allChainIds.map(cid => <div key={cid}><button style={{ minWidth: '12em', marginTop: '0.61em' }} className="font-bold border-2 border-black" onClick={toggleChainId.bind(null, cid)}>{sp.chainIdExclusions !== undefined && sp.chainIdExclusions.indexOf(cid) > -1 && 'no '}{getChainName(cid)}</button></div>)}
    <br />(Click token/chain to disable)
    <br /><br /><button className="text-1xl font-bold border-2 border-black" onClick={() => setResult(sp)}>Looks Good</button>
  </div>;
}

type CheckoutStep3Result = string // ie. Payment.toAddress

export const CheckoutStep3: React.FC<{ setResult: (r: CheckoutStep3Result) => void }> = ({ setResult }) => {
  // TODO delegate to AddressPicker reusable component that lets you type in an address, ENS, or connect wallet to provide one
  const { account } = useEthers();
  const [address, setAddress] = useState<string>(typeof account === 'string' ? account : '');

  useEffect(() => {
    if (address.length < 1 && typeof account === 'string') setAddress(account);
  }, [account, address, setAddress])

  return <div>
    <br /><label className="font-bold" htmlFor="address">Address to receive money (no ENS yet):</label>
    <br /><input style={{ width: '100%' }} id="address" type="text" placeholder={"0x123... or connect wallet"} onChange={(e) => setAddress(e.target.value)} value={address}></input>
    <br /><br /><button className={`text-1xl font-bold border-2 ${address.length > 0 ? 'border-black' : 'border-grey-600 font-extralight'}`} disabled={address.length < 1} onClick={() => { if (address.length > 0) /* TODO address validation, ensure it's at least a well-formed addressed, ENS resolves, etc. */ setResult(address) }}>Done</button>
  </div>;
}

export const CheckoutEditor: React.FC<{ setResult: (r: Checkout) => void }> = ({ setResult }) => {
  const [checkoutStep1Result, setCheckoutStep1Result] = useState<CheckoutStep1Result | undefined>(undefined);
  const [checkoutStep2Result, setCheckoutStep2Result] = useState<CheckoutStep2Result | undefined>(undefined);
  const [checkoutStep3Result, setCheckoutStep3Result] = useState<CheckoutStep3Result | undefined>(undefined);
  useEffect(() => {
    if (checkoutStep1Result !== undefined && checkoutStep2Result !== undefined && checkoutStep3Result !== undefined) {
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
    }
  }, [checkoutStep1Result, checkoutStep2Result, checkoutStep3Result, setResult]);
  const render = (() => {
    if (checkoutStep1Result === undefined) return <CheckoutStep1 setResult={setCheckoutStep1Result} />;
    else if (checkoutStep2Result === undefined) return <CheckoutStep2 setResult={setCheckoutStep2Result} />;
    else if (checkoutStep3Result === undefined) return <CheckoutStep3 setResult={setCheckoutStep3Result} />
    else return null;
  })();
  return render;
};
