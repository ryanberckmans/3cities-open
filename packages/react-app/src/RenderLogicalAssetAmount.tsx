import { formatUnits } from "@ethersproject/units";
import React from "react";
import { formatFloat } from "./formatFloat";
import { getDecimalsToRenderForLogicalAssetTicker, logicalAssetDecimals, LogicalAssetTicker } from "./logicalAssets";

type RenderLogicalAssetAmountProps = {
  logicalAssetTicker: LogicalAssetTicker; // logical asset ticker of the amount to be rendered
  amountAsBigNumberHexString: string; // logical asset amount to render as a BigNumber.toHexString(). Note that this amount must have been constructed using parseLogicalAssetAmount to properly respect logical asset decimal count
}

// RenderLogicalAssetAmount is a referentially transparent component
// to render the passed logical asset balance.
export const RenderLogicalAssetAmount: React.FC<RenderLogicalAssetAmountProps> = ({ logicalAssetTicker, amountAsBigNumberHexString }) => {
  const prefix: string = (() => {
    switch (logicalAssetTicker) {
      case 'ETH': return '';
      case 'USD': return '$';
      case 'CAD': return 'CAD$';
      case 'EUR': return '';
    }
  })();

  const suffix: string = (() => {
    switch (logicalAssetTicker) {
      case 'ETH': return ' ETH';
      case 'USD': return '';
      case 'CAD': return '';
      case 'EUR': return '€';
    }
  })();

  return <span>{prefix}{formatFloat(formatUnits(amountAsBigNumberHexString, logicalAssetDecimals), getDecimalsToRenderForLogicalAssetTicker(logicalAssetTicker))}{suffix}</span>;
}
