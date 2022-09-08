import { BigNumber } from "@ethersproject/bignumber";
import { TokenBalance } from "./tokenBalance";
import { TokenKey } from "./tokens";

// AddressContext is a snapshot of a single wallet address's
// state at a given point in time. Right now, the typical job
// of AddressContext in 3cities is to hold the latest up-to-date
// (block by block streaming updates) wallet token balances for
// all supported tokens on all supported L2s and the L1.
export type AddressContext = Readonly<{
  address: string; // the address for which this AddressContext is the snapshot
  tokenBalances: { [tk: TokenKey]: TokenBalance } // snapshot of token balances for this address (typically, balances for all (tokens X L2s) in one AddressContext)
}>

// emptyAddressContext is a convenience and safety function to
// construct an empty AddressContext.
export function emptyAddressContext(address: string): AddressContext {
  return {
    address,
    tokenBalances: {},
  };
}

// canAfford is a convenience predicate that returns true iff the
// passed address context can afford to transfer the passed amount of
// the token indicated by the passed token key.
export function canAfford(ac: AddressContext, tk: TokenKey, amountAsBigNumberHexString: string): boolean {
  const tb = ac.tokenBalances[tk];
  if (tb === undefined) return false;
  else return BigNumber.from(tb.balanceAsBigNumberHexString).gte(BigNumber.from(amountAsBigNumberHexString)); // NB here we are able to compare nominal amounts directly without worrying about units because the passed amount is denominated in the same token as the tokenbalance because both are for the passed token key
}
