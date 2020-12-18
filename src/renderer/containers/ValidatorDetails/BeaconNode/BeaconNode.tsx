import React, {useEffect, useState} from "react";
import {LogStream} from "../../../components/LogStream/LogStream";
import {BeaconChain} from "../../../services/docker/chain";
import {DockerRegistry} from "../../../services/docker/docker-registry";
import {Beacon} from "../../../ducks/beacon/slice";
import {BeaconNodeResponseTimeChart} from "./BeaconNodeResponseTimeChart";
import {
    BeaconNodeResponseErrorPieChart,
    emptyResponseErrorPieData,
    ResponseErrorPieData
} from "./BeaconNodeResponseErrorPieChart";
import database from "../../../services/db/api/database";
import {addMinutes, format, roundToNearestMinutes, subDays, subMinutes} from "date-fns";
import {SimpleLineChartRecord} from "../../../components/SimpleLineChart/SimpleLineChart";

interface IBeaconNodeProps {
    beacon: Beacon;
    showTitle?: boolean;
}

export const BeaconNode: React.FC<IBeaconNodeProps> = ({beacon: {url, docker}, showTitle = true}) => {
    const container = DockerRegistry.getContainer(docker.id) as BeaconChain;

    const [avgLatency, setAvgLatency] = useState<SimpleLineChartRecord[]>([]);
    const [avgLatencyTicks, setAvgLatencyTicks] = useState<string[]>([]);
    const [pieData, setPieData] = useState([...emptyResponseErrorPieData] as ResponseErrorPieData);

    useEffect(() => {
        const intervalFn = async (): Promise<void> => {
            const metrics = await database.networkMetrics.get(url);

            // for latency chart
            const baseTime = roundToNearestMinutes(subDays(new Date(), 1), {nearestTo: 15});
            const newLatencyTicks: string[] = [];
            const newLatencyData = new Array(96).fill(null).map((_, index) => {
                const time = addMinutes(new Date(baseTime), index * 15);
                const value =
                    Math.round(metrics.getNetworkAverageLatency(subMinutes(time, 15), addMinutes(time, 15))) || null;
                const label = format(time, "k:mm");
                if (label.includes("00")) newLatencyTicks.push(label);
                return {value, label};
            });
            setAvgLatency(newLatencyData);
            setAvgLatencyTicks(newLatencyTicks);

            // for error pie chart
            setPieData(metrics.getNetworkErrorPieData());
        };
        intervalFn();
        const interval = setInterval(intervalFn, 60 * 1000);
        return (): void => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className='flex-column stretch'>
            {showTitle && (
                <div className='row space-between' style={{paddingTop: "25px"}}>
                    <h2>Beacon Node</h2>
                    <h5>{url}</h5>
                </div>
            )}

            <div className='beacon-node-charts-container'>
                <BeaconNodeResponseTimeChart data={avgLatency} ticks={avgLatencyTicks} />
                <BeaconNodeResponseErrorPieChart data={pieData} />
            </div>

            {container && (
                <div className='box log-stream-container'>
                    <h4>Log Stream</h4>
                    <LogStream source={container ? container.getLogs()! : undefined} />
                </div>
            )}
        </div>
    );
};
