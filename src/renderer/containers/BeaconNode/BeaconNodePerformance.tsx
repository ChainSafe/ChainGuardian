import React, {useEffect, useState} from "react";
import {Beacon} from "../../ducks/beacon/slice";
import {DockerRegistry} from "../../services/docker/docker-registry";
import {BeaconChain} from "../../services/docker/chain";
import {Stats} from "../../services/docker/stats";
import {AxisDomain, ResponsiveContainer} from "recharts";
import {SimpleLineChart, SimpleLineChartRecord} from "../../components/SimpleLineChart/SimpleLineChart";
import {format} from "date-fns";

interface IBeaconNodeProps {
    beacon: Beacon;
}

const noData: SimpleLineChartRecord[] = new Array(100).fill({label: ""});
export const BeaconNodePerformance: React.FC<IBeaconNodeProps> = ({beacon: {docker}}) => {
    const container = docker && (DockerRegistry.getContainer(docker.id) as BeaconChain);
    if (!container) return null;

    const [stats, setStats] = useState<Stats>();
    const [cpu, setCpu] = useState<SimpleLineChartRecord[]>([...noData]);
    const [ram, setRam] = useState<SimpleLineChartRecord[]>([...noData]);

    useEffect(() => {
        (async function (): Promise<void> {
            for await (const stats of DockerRegistry.getStatsIterator(docker.id)) {
                setStats(stats);

                if (stats && stats.cpu && stats.memory?.percentage) {
                    const label = format(new Date(), "k:mm:ss");
                    setCpu((oldState) => {
                        oldState.shift();
                        return [...oldState, {label, value: stats.cpu}];
                    });
                    setRam((oldState) => {
                        oldState.shift();
                        return [...oldState, {label, value: stats.memory.percentage + Math.random() * 0.05}];
                    });
                }
            }
        })();
    }, []);

    if (!stats) return null;

    const domain: [AxisDomain, AxisDomain] = [0, 100];

    return (
        <div className='flex-column stretch'>
            <div className='row space-between' style={{paddingTop: "25px"}}>
                <h2>Hardware Usage</h2>
            </div>

            <div className='beacon-node-charts-container'>
                <div className='node-graph-container' style={{width: 625}}>
                    <div className='graph-header'>
                        <div className='graph-title'>CPU</div>
                        <div className='graph-title'>{stats.cpu}%</div>
                    </div>
                    <div className='graph-content'>
                        <ResponsiveContainer width='100%' height={200}>
                            <SimpleLineChart data={cpu} isAnimationActive={false} hideTooltip />
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className='node-graph-container' style={{width: 625}}>
                    <div className='graph-header'>
                        <div className='graph-title'>Ram</div>
                        <div className='graph-title'>{stats.memory.percentage}%</div>
                    </div>
                    <div className='graph-content'>
                        <ResponsiveContainer width='100%' height={200}>
                            <SimpleLineChart data={ram} yAxis={{domain}} isAnimationActive={false} hideTooltip />
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <br />
        </div>
    );
};
