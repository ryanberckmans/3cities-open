import { BigNumber } from "@ethersproject/bignumber";
import { NativeCurrency, Token } from "@usedapp/core";
import { Agreement, isReceiverProposedPayment, ProposedAgreement } from "./agreements";
import { convertLogicalAssetUnits } from "./logicalAssets";
import { getNativeCurrenciesAndTokensForLogicalAssetTicker } from "./logicalAssetsToTokens";
import { TokenTransfer } from "./tokenTransfer";

// StrategyPreferences are preferences expressed by one or more
// counterparties that restrict and/or shape the set of strategies (or
// proposed strategies) available to fulfill an agreement (or proposed
// agreement). The idea here is to allow a seller to say eg., "I don't
// care what chain you send me tokens on, but I don't want Tether".
export type StrategyPreferences = {
  tokenTickerExclusions?: string[], // list of tokenTickers (ie. NativeCurrency.ticker or Token.ticker) that should be ignored when computing agreement execution strategies. Eg. if a user didn't want to transact in Tether, they may set `tokenTickerExclusions: ['USDT']`
  chainIdExclusions?: number[], // list of chainIds that should be ignored when computing agreement execution strategies. Eg. if a user didn't want to transact on mainnet, they may set `chainIdExclusions: [1]`
};

// isTokenPermittedByStrategyPreferences returns true iff the passed
// strategy preferences permits the passed token to be included in
// strategy generation.
function isTokenPermittedByStrategyPreferences(prefs: StrategyPreferences, token: NativeCurrency | Token): boolean {
  if (prefs.tokenTickerExclusions && prefs.tokenTickerExclusions.indexOf(token.ticker) > -1) return false; // WARNING ~O(N^2) when used in a list of tokens, if data size grows, in future we may want to convert tokenTickerExclusions to a map { [ticker: string]: true }
  if (prefs.chainIdExclusions && prefs.chainIdExclusions.indexOf(token.chainId) > -1) return false; // WARNING ~O(N^2) when used in a list of tokens, if data size grows, in future we may want to convert chainIdExclusions to a map { [chainId: number]: true }
  return true;
}

// Strategy represents one plan (ie. strategic alternative) that is
// sufficient to fulfill the agreement contained in this strategy. The
// idea here is for an agreement to generate a set of strategies, and
// then the user picks one of the strategies to execute.
export type Strategy = {
  agreement: Agreement, // the agreement which is being fulfilled by this strategy
  tokenTransfer: TokenTransfer, // the single token transfer which, once completed, will represent the execution of this agreement. NB here we have restricted the concept of which actions a strategy may take to single token transfers. In future it might become appropriate for Strategy to have a more complex relationship with the actions it describes, eg. `tokenTransfers: TokenTransfer[]`, `actions: (TokenTransfer | FutureType)[]`, etc.
}

// ReceiverProposedTokenTransfer is a TokenTransfer that's been
// proposed by the receiver, ie. it lacks a sender.
export type ReceiverProposedTokenTransfer = Omit<TokenTransfer, 'fromAddress'>

// ProposedStrategy is a draft proposal to take actions sufficient to
// fulfill the proposed agreement between at least one concrete
// participant and at least one unspecified participant. The idea here
// is that given a proposed agreement hasn't yet been accepted by the
// counterparty(ies), the function of a proposed strategy is to say,
// "let me help you make a decision and motivate you to accept the
// agreement by showing you an example of the actions you could take
// to fulfill this agreement"
export type ProposedStrategy = {
  proposedAgreement: ProposedAgreement, // the proposed agreement which this proposed strategy may end up fulfilling fulfill if the proposal is accepted
  receiverProposedTokenTransfer: ReceiverProposedTokenTransfer, // the single proposed token transfer which, once accepted and completed, will represent the execution of this agreement. See design note on Strategy.tokenTransfer
}

// getProposedStrategiesForProposedAgreement computes the proposed
// strategies for the passed proposed agreement, taking into account
// the passed strategy preferences.
export function getProposedStrategiesForProposedAgreement(prefs: StrategyPreferences, pa: ProposedAgreement): ProposedStrategy[] {
  const pss: ProposedStrategy[] = [];
  if (isReceiverProposedPayment(pa)) {
    const ts = getNativeCurrenciesAndTokensForLogicalAssetTicker(pa.logicalAssetTicker);
    pss.push(...ts.filter(isTokenPermittedByStrategyPreferences.bind(null, prefs)).map(token => {
      return {
        proposedAgreement: pa,
        receiverProposedTokenTransfer: {
          toAddress: pa.toAddress,
          token,
          amountAsBigNumberHexString: convertLogicalAssetUnits(BigNumber.from(pa.amountAsBigNumberHexString), token.decimals).toHexString(),
        },
      };
    }))
  }
  // TODO support generation of strategies based on exchange rates, eg. if payment is for $5 USD then we should support a strategy of paying $5 in ETH and vice versa
  console.log("getProposedStrategiesForProposedAgreement prefs=", prefs, "pa=", pa, "r=", pss);
  return pss;
}

// TODO def getStrategiesForAgreement(prefs: StrategyPreferences, a: Agreement, ac: AddressContext): Strategy[] --> // similar to getProposedStrategiesForProposedAgreement but also filters by tokens available in AddressContext and binds the strategies to ac.address
