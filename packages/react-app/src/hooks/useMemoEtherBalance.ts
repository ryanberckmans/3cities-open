import { BigNumber } from "@ethersproject/bignumber";
import { useEtherBalance } from "@usedapp/core";
import { useMemo } from "react";

// useMemoEtherBalance is a React hook that returns a live-reloaded
// ETH (or other native chain currency) balance for the passed address
// and chainId. useMemoEtherBalance exists to fix a memoization bug in
// usedapp's useEtherBalance, see below.
export function useMemoEtherBalance(
  address: string, // address whose native currency balance will be live-reloaded
  chainId: number, // chainId whose native currency balance will be live-reloaded
): BigNumber | undefined {
  const bRaw = useEtherBalance(address, { chainId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const b = useMemo(() => bRaw, [bRaw && bRaw._hex]); // there's a performance bug in useDapp where their hook useEtherBalance delegates to useCall which delegates to useCalls which makes use of useMemo on call results as a general solution to avoid triggering re-renders https://github.com/TrueFiEng/useDApp/blob/40c1d86d2516a948fc88bf52ceed457dac22345a/packages/core/src/hooks/useCall.ts#L52, however, two BigNumbers for the same value fail this memoization check because they are different BigNumber objects, and this causes useEtherBalance to trigger re-renders every new block because the BigNumber object instance has changed even if the balance has not changed. To fix this performance bug of triggering an unnecessary re-render every new block even when balance doesn't change, we memoize the BigNumber by its hex representation
  return b;
}
