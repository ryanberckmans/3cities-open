import { useEthers, useLookupAddress } from "@usedapp/core";

// useAddressOrENS returns the currently connected wallet address's
// primary ENS name, or else the address itself if no primary ENS name
// is set, or else undefined if no address is connected.
export default function useAddressOrENS(): string | undefined {
    const { account } = useEthers();
    const ens = useLookupAddress();
    if (typeof account !== 'string') return undefined;
    if (typeof ens === 'string') return ens;
    return account;
}
