import { LogicalAssetTicker } from "./logicalAssets";

// Agreement is an economic agreement between multiple concrete
// participants.
export type Agreement = Donation | UnusedAgreement;

// ProposedAgreement is a proposal between at least one concrete
// participant and at least one unspecified participant, ie. a
// ProposedAgreement is an Agreement that's incomplete because it
// hasn't yet been accepted/completed.
export type ProposedAgreement = ReceiverProposedDonation | ProposedUnusedAgreement;

// Donation is an agreement for a sender to donate to a
// receiver an amount of a logical asset.
export type Donation = {
  senderAddress: string; // sender address making the donation
  receiverAddress: string; // receiver address receiving the donation
  logicalAssetTicker: LogicalAssetTicker; // logical asset ticker of the asset being donated
  amountAsBigNumberHexString: string; // amount of the donation in units of the logical asset as a BigNumber.toHexString()
  _isDonation: true; // internal field to help match an Agreement into a Donation
};

// ReceiverProposedDonation is a Donation that's been proposed by the
// receiver, ie. it lacks a sender.
export type ReceiverProposedDonation = Omit<Donation, 'senderAddress'>;

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
