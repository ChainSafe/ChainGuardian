import React, {useEffect, useState} from "react";
import {LogStream} from "../../components/LogStream/LogStream";
import {BeaconChain} from "../../services/docker/chain";
import {DockerRegistry} from "../../services/docker/docker-registry";
import {Beacon, BeaconStatus} from "../../ducks/beacon/slice";
import {BeaconNodeResponseTimeChart} from "./BeaconNodeResponseTimeChart";
import {BeaconNodeResponseErrorPieChart, ResponseErrorPieData} from "./BeaconNodeResponseErrorPieChart";
import database from "../../services/db/api/database";
import {SimpleLineChartRecord} from "../../components/SimpleLineChart/SimpleLineChart";
import {getLatencyChartData, getNetworkErrorPieData} from "../../services/utils/charts";
import ReactTooltip from "react-tooltip";
import {capitalize} from "../../services/utils/formatting";
import {Stats} from "../../services/docker/dockerStats";

interface IBeaconNodeProps {
    beacon: Beacon;
    showTitle?: boolean;
}

export const BeaconNode: React.FC<IBeaconNodeProps> = ({
    beacon: {url, network, slot, status, docker},
    showTitle = true,
}) => {
    const container = docker && (DockerRegistry.getContainer(docker.id) as BeaconChain);

    const [avgLatency, setAvgLatency] = useState<SimpleLineChartRecord[]>([]);
    const [avgLatencyTicks, setAvgLatencyTicks] = useState<string[]>([]);
    const [pieData, setPieData] = useState<ResponseErrorPieData>([
        {name: "2xx", value: null, color: "#09BC8A"},
        {name: "4xx", value: null, color: "#EDFF86"},
        {name: "5xx", value: null, color: "#EA526F"},
    ]);
    const [stats, setStats] = useState<Stats>();

    useEffect(() => {
        const intervalFn = async (): Promise<void> => {
            const metrics = await database.networkMetrics.get(url);

            // for latency chart
            const newLatencyData = getLatencyChartData(metrics);
            setAvgLatency(newLatencyData.data);
            setAvgLatencyTicks(newLatencyData.ticks);

            // for error pie chart
            setPieData(getNetworkErrorPieData(metrics));
        };
        intervalFn();
        const interval = setInterval(intervalFn, 60 * 1000);

        (async function (): Promise<void> {
            for await (const stats of DockerRegistry.getStatsIterator(docker.id)) {
                setStats(stats);
            }
        })();
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

            <div className='row space-between'>
                <h2>{capitalize(network)}</h2>
                <div className='row slot-container'>
                    <h3>slot</h3>
                    <h2>
                        {status !== BeaconStatus.offline
                            ? status === BeaconStatus.starting
                                ? "starting"
                                : slot
                            : "N/A"}
                    </h2>
                    {status !== BeaconStatus.offline ? (
                        <>
                            <ReactTooltip />
                            <span
                                className={
                                    status === BeaconStatus.syncing || status === BeaconStatus.starting
                                        ? "sync-progress-icon"
                                        : "success-icon"
                                }
                                data-tip={status === BeaconStatus.syncing ? "Syncing" : "Synced"}
                            />
                        </>
                    ) : null}
                </div>
            </div>

            {stats && (
                <div className='row space-between'>
                    <h2>Hardware Usage</h2>
                    <div style={{display: "flex"}}>
                        <div className='row slot-container'>
                            <h3>cpu</h3>
                            <h2>{stats.cpu}%</h2>
                        </div>
                        <div className='row slot-container' style={{marginLeft: 20}}>
                            <h3>ram</h3>
                            <h2>{stats.memory.percentage}%</h2>
                        </div>
                    </div>
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
