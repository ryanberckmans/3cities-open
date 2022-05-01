import { BigNumber } from "@ethersproject/bignumber";
import { useTokenBalance } from "@usedapp/core";
import { useMemo } from "react";

// useMemoTokenBalance is a React hook that returns a live-reloaded
// token balance for the passed token address, address, and chainId.
// useMemoTokenBalance exists to fix a memoization bug in usedapp's
// useTokenBalance, see below.
export function useMemoTokenBalance(
  tokenAddress: string, // token contract address whose token balance will be live-reloaded
  address: string, // address whose token balance will be live-reloaded
  chainId: number, // chainId on which tokenAddress contract resides
): BigNumber | undefined {
  const bRaw = useTokenBalance(tokenAddress, address, { chainId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const b = useMemo(() => bRaw, [bRaw && bRaw._hex]); // there's a performance bug in useDapp where their hook useTokenBalance delegates to useCall which delegates to useCalls which makes use of useMemo on call results as a general solution to avoid triggering re-renders https://github.com/TrueFiEng/useDApp/blob/40c1d86d2516a948fc88bf52ceed457dac22345a/packages/core/src/hooks/useCall.ts#L52, however, two BigNumbers for the same value fail this memoization check because they are different BigNumber objects, and this causes useTokenBalance to trigger re-renders every new block because the BigNumber object instance has changed even if the balance has not changed. To fix this performance bug of triggering an unnecessary re-render every new block even when balance doesn't change, we memoize the BigNumber by its hex representation
  return b;
}
