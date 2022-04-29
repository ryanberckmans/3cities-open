import { BigNumber } from "@ethersproject/bignumber";
import { TokenKey } from "./usedappCurrencies";

export type TokenBalance = Readonly<{
  address: string; // user address for this token balance
  tokenKey: TokenKey; // TokenKey of the NativeCurrency or Token for this token balance
  balance: BigNumber; // the actual token balance
  balanceAsOf: number; // time at which this token balance was snapshotted in milliseconds since epoch
}>

export type AddressContext = Readonly<{
  address: string;
  tokenBalances: { [tk: TokenKey]: TokenBalance }
}>
