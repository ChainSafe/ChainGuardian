import {NetworkMetrics} from "../../models/networkMetrics";
import {SimpleLineChartRecord} from "../../components/SimpleLineChart/SimpleLineChart";
import {addMinutes, format, roundToNearestMinutes, subDays, subMinutes} from "date-fns";
import {ResponseErrorPieData} from "../../containers/BeaconNode/BeaconNodeResponseErrorPieChart";

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
