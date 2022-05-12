import { abis } from "@3cities/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { Token, TransactionStatus, useContractFunction, useEthers } from "@usedapp/core";
import React from "react";
import { isToken } from "./tokens";
import { TokenTransfer } from "./tokenTransfer";

type ExecuteTokenTransferButtonProps = {
  tt: TokenTransfer;
}

export const ExecuteTokenTransferButton: React.FC<ExecuteTokenTransferButtonProps> = ({ tt }) => {
  const token = tt.token;
  return isToken(token) ? <ExecuteTokenTransferButtonInternal tt={Object.assign({}, tt, { token })} /> : <span></span>;
}

type ExecuteTokenTransferButtonInternalProps = {
  tt: TokenTransfer & {
    token: Token;
  };
}

const ExecuteTokenTransferButtonInternal: React.FC<ExecuteTokenTransferButtonInternalProps> = ({ tt }) => {
  const { execute, state } = useExecuteTokenTransfer(tt);
  // TODO disable button; tx status; verify chainId switch behavior

  const isDisabled =
    state.status == 'PendingSignature' ||
    state.status == 'Mining';

  const statusNote: string = (() => {
    switch (state.status) {
      case 'None': return '';
      case 'PendingSignature': return ' (sign in wallet)';
      case 'Mining': return ' (processing...)';
      case 'Success': return ' (paid)';
      case 'Fail': return ' (failed)';
      case 'Exception': return ''; // eg. user refused the signature, so instead of displaying an error, we'll render no status and they may retry
    }
  })();

  return <button disabled={isDisabled} className={`font-bold border-2 ${!isDisabled ? 'border-black' : 'border-grey-600 font-extralight'}`} onClick={execute}>Pay Now{statusNote}</button>;
}

function useExecuteTokenTransfer(tt: TokenTransfer & {
  token: Token; // TODO support native currency transfers. This type intersection is a way to ensuring that the passed TokenTransfer is for a Token and not a NativeCurrency --> when supporting Native Currency, there's a problem to solve of conditional execution of hooks (eg. because useContractFunction uses the Contract which is only constructed for Tokens and not NativeCurrencies)
}): {
  state: TransactionStatus;
  execute: () => void;
} {
  const { account, library, chainId, switchNetwork } = useEthers();
  const c: Contract = new Contract(tt.token.address, abis.erc20, library);
  const { send, state } = useContractFunction(c, 'transfer');
  return {
    state,
    execute: () => {
      if (account === tt.fromAddress) { // WARNING here we treat TokenTransfer execution as a no-op if the current connected wallet address (which is the implicit sender of the tx) is not equal to the fromAddress in the tokenTransfer. TODO I'm not sure what to do here-- strategies can only be computed in the context of a fromAddress, but after they have been computed, they seem to execute in the context of whatever connected wallet. And that strategy's transaction could fail at runtime in the wallet if the token balance isn't present, eg. if the user's active wallet isn't the same one for which the strategies were computed or if the wallet's token balances have become stale and the transfer has become unaffordable
        if (chainId === undefined) {
          console.warn("useExecuteTokenTransfer: connected wallet chainId was unexpectedly undefined");
        } else if (chainId !== tt.token.chainId) {
          // The connected wallet's selected network is not the same network as the token transfer is on. We'll pop up a network switch request, and user will then have to click the Pay button again after switching network
          switchNetwork(tt.token.chainId);
        } else send(tt.toAddress, BigNumber.from(tt.amountAsBigNumberHexString));
      }
    },
  };
}
