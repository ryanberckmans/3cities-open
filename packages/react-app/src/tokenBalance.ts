import { TokenKey } from "./usedappCurrencies";

// TokenBalance is a snapshot of an address's token balance on a
// specific chain. For example, a snapshot of Bob's DAI balance on
// Arbitrum.
export type TokenBalance = Readonly<{
  address: string; // user address for this token balance
  tokenKey: TokenKey; // TokenKey of the NativeCurrency or Token for this token balance
  balanceAsBigNumberHexString: string; // the actual token balance as a BigNumber.toHexString()
  balanceAsOf: number; // time at which this token balance was snapshotted in milliseconds since epoch
}>
