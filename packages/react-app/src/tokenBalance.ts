import { TokenKey } from "./usedappCurrencies";

export type TokenBalance = Readonly<{
  address: string; // user address for this token balance
  tokenKey: TokenKey; // TokenKey of the NativeCurrency or Token for this token balance
  balanceAsBigNumberHexString: string; // the actual token balance as a BigNumber.toHexString()
  balanceAsOf: number; // time at which this token balance was snapshotted in milliseconds since epoch
}>
