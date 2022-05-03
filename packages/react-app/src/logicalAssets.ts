
// Design note: we have designed logical assets to have no dependecies (or at least, no dependency on tokens) so that the infrastructure for building and computing data structures over logical assets is separate from and doesn't depend on our supported crypto tokens or chains. Below, we implicitly connect logical assets to crypto tokens by providing a list of supported crypto token tickers for each logical asset. Note that these crypto token tickers don't actually have to exist and be supported by our system; if they don't exist, they'll simply be ignored silently at runtime.

export type LogicalAssetTicker = 'ETH' | 'USD' | 'CAD' | 'EUR';

export type LogicalAsset = {
  ticker: LogicalAssetTicker, // ticker for this logical asset
  name: string, // human-readable name for this logical asset
  supportedTokenTickers: { [tokenTicker: string]: true }, // set of crypto tokens we support where 1.0 unit sof each of these tokens is equivalent to 1.0 units of this logical asset. For example, "1 DAI == 1 USD"
};

export const logicalAssetsByTicker: Readonly<{ [key in LogicalAssetTicker]: LogicalAsset }> = {
  'ETH': {
    ticker: 'ETH',
    name: 'Ether',
    supportedTokenTickers: {
      'ETH': true,
      'WETH': true,
    },
  },
  'USD': {
    ticker: 'USD',
    name: 'US Dollars',
    supportedTokenTickers: {
      'DAI': true,
      'USDC': true,
      'USDT': true,
    },
  },
  'CAD': {
    ticker: 'CAD',
    name: 'Canadian Dollars',
    supportedTokenTickers: {
      'CADC': true,
    },
  },
  'EUR': {
    ticker: 'EUR',
    name: 'Euros',
    supportedTokenTickers: {
      'EURT': true,
    },
  },
};

export const logicalAssets: Readonly<LogicalAsset[]> = Object.values(logicalAssetsByTicker);
