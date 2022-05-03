
export type StrategyPreferences = {
  tokenTickerExclusions?: string[], // list of tokenTickers (ie. NativeCurrency.ticker or Token.ticker) that should be ignored when computing agreement execution strategies. Eg. if a user didn't want to transact in Tether, they may set `tokenTickerExclusions: ['USDT']`
  chainIdExclusions?: number[], // list of chainIds that should be ignored when computing agreement execution strategies. Eg. if a user didn't want to transact on mainnet, they may set `chainIdExclusions: [1]`
};
