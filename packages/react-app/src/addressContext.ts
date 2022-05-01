import { TokenBalance } from "./tokenBalance";
import { TokenKey } from "./usedappCurrencies";

export type AddressContext = Readonly<{
  address: string;
  tokenBalances: { [tk: TokenKey]: TokenBalance }
}>

// emptyAddressContext is a convenience and safety function to
// construct an empty AddressContext.
export function emptyAddressContext(address: string): AddressContext {
  return {
    address,
    tokenBalances: {},
  };
}
