import { NativeCurrency, Token } from "@usedapp/core";

// TokenTransfer represents a single token transfer of a native
// currency or token from a sender to a receiver.
export type TokenTransfer = {
  toAddress: string; // address receiving this token transfer
  fromAddress: string; // address sending this token transfer
  token: NativeCurrency | Token; // token being transferred
  amountAsBigNumberHexString: string; // amount of the transfer in full-precision units of the token (ie. the amount expressed in minimal units of the token based on its number of decimals, eg. wei for ETH, 10^-18 dollars for DAI, 10^-6 dollars for USDC, etc.) as a BigNumber.toHexString()
};
