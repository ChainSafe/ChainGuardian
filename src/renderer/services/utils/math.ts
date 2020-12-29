import {getNetworkConfig} from "../eth2/networks";

function divBigInt(a: bigint, b: bigint): number {
    return Number((a * BigInt(10000000000)) / b) / 10000000000;
}

export function calculateROI(balance: bigint, network: string): number | undefined {
    if (!balance) return undefined;
    const effectiveBalance = getNetworkConfig(network).eth2Config.params.MAX_EFFECTIVE_BALANCE;
    if (balance === effectiveBalance) {
        return 0;
    }

    const gains = balance > effectiveBalance ? balance - effectiveBalance : effectiveBalance - balance;
    const percentage = divBigInt(gains, effectiveBalance) * 100;
    const unsignedPercentage = balance > effectiveBalance ? percentage : percentage * -1;
    return Number(unsignedPercentage.toFixed(2));
}
