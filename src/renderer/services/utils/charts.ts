import {NetworkMetrics} from "../../models/networkMetrics";
import {SimpleLineChartRecord} from "../../components/SimpleLineChart/SimpleLineChart";
import {addMinutes, format, roundToNearestMinutes, subDays, subMinutes, endOfDay, addDays, startOfDay} from "date-fns";
import {ResponseErrorPieData} from "../../containers/BeaconNode/BeaconNodeResponseErrorPieChart";
import {ValidatorBalance} from "../../models/validatorBalances";
import {getNetworkConfig} from "../eth2/networks";
import {computeTimeAtSlot, computeStartSlotAtEpoch} from "@chainsafe/lodestar-beacon-state-transition";
import {AttestationEffectiveness} from "../../models/attestationEffectiveness";
import {AttestationRecord} from "../../containers/ValidatorDetails/ValidatorStats/ValidatorAttestationEfficiencyChart";

export const getLatencyChartData = (metrics: NetworkMetrics): {data: SimpleLineChartRecord[]; ticks: string[]} => {
    const baseTime = roundToNearestMinutes(subDays(new Date(), 1), {nearestTo: 15});
    const ticks: string[] = [];
    const data = new Array(96).fill(null).map((_, index) => {
        const time = addMinutes(new Date(baseTime), index * 15);
        const value = Math.round(metrics.getNetworkAverageLatency(subMinutes(time, 15), addMinutes(time, 15))) || null;
        const label = format(time, "k:mm");
        if (label.includes("00")) ticks.push(label);
        return {value, label};
    });

    return {data, ticks};
};

export const getAttestationEfficiencyChartData = (
    attestationEffectiveness: AttestationEffectiveness,
): AttestationRecord[] => {
    const baseTime = subDays(new Date(), 6);
    return new Array(7).fill(null).map((_, index) => {
        const time = addDays(new Date(baseTime), index);
        const value =
            Math.round(attestationEffectiveness.getAverageAttestationEfficiency(startOfDay(time), endOfDay(time))) ||
            null;
        const label = format(time, "EEEE");
        return {value, label};
    });
};

export const getNetworkErrorPieData = (metrics: NetworkMetrics): ResponseErrorPieData => {
    const pieData: ResponseErrorPieData = [
        {name: "2xx", value: null, color: "#09BC8A"},
        {name: "4xx", value: null, color: "#EDFF86"},
        {name: "5xx", value: null, color: "#EA526F"},
    ];
    metrics.records.forEach(({code}) => {
        if (code >= 200 && code < 300) {
            if (pieData[0].value === null) pieData[0].value = 0;
            pieData[0].value++;
        } else if (code >= 400 && code < 500) {
            if (pieData[1].value === null) pieData[1].value = 0;
            pieData[1].value++;
        } else if (code >= 500) {
            if (pieData[2].value === null) pieData[2].value = 0;
            pieData[2].value++;
        }
    });
    return pieData;
};

export const getValidatorBalanceChartData = (
    validatorBalances: ValidatorBalance[],
    network: string,
): {epoch: SimpleLineChartRecord[]; date: SimpleLineChartRecord[]} => {
    const data: {epoch: SimpleLineChartRecord[]; date: SimpleLineChartRecord[]} = {epoch: [], date: []};
    if (!validatorBalances.length) return data;

    const {eth2Config, genesisTime} = getNetworkConfig(network);

    const firstEpoch = validatorBalances[0].epoch;
    const lastEpoch = validatorBalances[validatorBalances.length - 1].epoch;
    const arrayLength = Number(lastEpoch - firstEpoch) + 1;
    let skipped = 0;
    Array(arrayLength)
        .fill(null)
        .forEach((_, index) => {
            const epoch = index + Number(firstEpoch);
            const balancesIndex = index - skipped;
            const slot = computeStartSlotAtEpoch(eth2Config, epoch);
            const time = new Date(computeTimeAtSlot(eth2Config, slot, genesisTime) * 1000);
            const date = format(time, "d MMM, yyyy  HH:mm");

            if (Number(validatorBalances[balancesIndex].epoch) === epoch) {
                data.epoch.push({label: String(epoch), value: Number(validatorBalances[balancesIndex].balance)});
                data.date.push({label: date, value: Number(validatorBalances[balancesIndex].balance)});
            } else {
                skipped++;
                data.epoch.push({label: String(epoch)});
                data.date.push({label: date});
            }
        });

    return data;
};
