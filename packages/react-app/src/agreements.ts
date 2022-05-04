import { LogicalAssetTicker } from "./logicalAssets";

// Agreement is an economic agreement between multiple concrete
// participants.
export type Agreement = Donation | UnusedAgreement;

export function isDonation(a: Agreement): a is Donation {
  return Object.prototype.hasOwnProperty.call(a, "_d");
}

// ProposedAgreement is a proposal between at least one concrete
// participant and at least one unspecified participant, ie. a
// ProposedAgreement is an Agreement that's incomplete because it
// hasn't yet been accepted by the counterparty(ies).
export type ProposedAgreement = ReceiverProposedDonation | ProposedUnusedAgreement;

export function isReceiverProposedDonation(pa: ProposedAgreement): pa is ReceiverProposedDonation {
  return Object.prototype.hasOwnProperty.call(pa, "_rpd");
}

// Donation is an agreement for a sender to donate to a
// receiver an amount of a logical asset.
export type Donation = {
  toAddress: string; // address receiving the donation
  fromAddress: string; // address sending the donation
  logicalAssetTicker: LogicalAssetTicker; // logical asset ticker of the asset being donated
  amountAsBigNumberHexString: string; // amount of the donation in units of the logical asset as a BigNumber.toHexString(). TODO support complex amount eg. "more than $5", "any amount", "exactly $69.420", etc.
  _d: true; // internal field to help match an Agreement into a Donation
};


// ReceiverProposedDonation is a Donation that's been proposed by the
// receiver, ie. it lacks a sender.
export type ReceiverProposedDonation = Omit<Donation, 'fromAddress' | '_d'> & {
  _rpd: true; // internal field to help match an ProposedAgreement into a ReceiverProposedDonation
};

// UnusedAgreement is an agremeent that's not yet used and is a
// placeholder to exemplify the fact that Agreement is intended to be
// a sum type of different types of agreements.
export type UnusedAgreement = {
  unused: string;
  _isUnusedAgreement: true; // internal field to help match an Agreement into an UnusedAgreement
}

// ProposedUnusedAgreement is a proposed agreement that's not yet used
// and is a placeholder to exemplify the fact that ProposedAgreement
// is intended to be a sum type of different types of proposed
// agreements.
export type ProposedUnusedAgreement = Exclude<UnusedAgreement, 'unused'>;
