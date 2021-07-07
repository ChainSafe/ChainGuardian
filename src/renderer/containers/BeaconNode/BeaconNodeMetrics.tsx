import React, {useEffect, useState} from "react";
import {Beacon} from "../../ducks/beacon/slice";
import {ResponsiveContainer} from "recharts";
import {SimpleLineChart, SimpleLineChartRecord} from "../../components/SimpleLineChart/SimpleLineChart";
import {format} from "date-fns";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {getBeaconNodeEth2ApiClient} from "../../services/eth2/client/utils";

interface IBeaconNodeProps {
    beacon: Beacon;
}

type PoolState = {
    attestations: SimpleLineChartRecord[];
    attesterSlashings: SimpleLineChartRecord[];
    voluntaryExits: SimpleLineChartRecord[];
    proposerSlashings: SimpleLineChartRecord[];
};

type PeersState = {
    connected: SimpleLineChartRecord[];
    connecting: SimpleLineChartRecord[];
    disconnected: SimpleLineChartRecord[];
    disconnecting: SimpleLineChartRecord[];
};

const noData: SimpleLineChartRecord[] = new Array(100).fill({label: ""});
export const BeaconNodeMetrics: React.FC<IBeaconNodeProps> = ({beacon: {url}}) => {
    const [pool, setPool] = useState<PoolState>({
        attestations: [...noData],
        attesterSlashings: [...noData],
        voluntaryExits: [...noData],
        proposerSlashings: [...noData],
    });
    const [peers, setPeers] = useState<PeersState>({
        connected: [...noData],
        connecting: [...noData],
        disconnected: [...noData],
        disconnecting: [...noData],
    });

    useEffect(() => {
        let canUpdate = true;
        const interval = setInterval(async () => {
            const label = format(new Date(), "k:mm:ss");

            const ApiClient = await getBeaconNodeEth2ApiClient(url);
            const eth2API = new ApiClient(config, url);

            const poolState = await eth2API.beacon.pool.getPoolStatus();
            const peerCount = await eth2API.node.getPeerCount();

            if (canUpdate) {
                setPool((oldState) => {
                    oldState.attestations.shift();
                    oldState.attesterSlashings.shift();
                    oldState.voluntaryExits.shift();
                    oldState.proposerSlashings.shift();
                    return {
                        attestations: [...oldState.attestations, {label, value: poolState.attestations}],
                        attesterSlashings: [...oldState.attesterSlashings, {label, value: poolState.attesterSlashings}],
                        voluntaryExits: [...oldState.voluntaryExits, {label, value: poolState.voluntaryExits}],
                        proposerSlashings: [...oldState.proposerSlashings, {label, value: poolState.proposerSlashings}],
                    };
                });

                setPeers((oldState) => {
                    oldState.connected.shift();
                    oldState.connecting.shift();
                    oldState.disconnected.shift();
                    oldState.disconnecting.shift();
                    return {
                        connected: [...oldState.connected, {label, value: peerCount.connected}],
                        connecting: [...oldState.connecting, {label, value: peerCount.connecting}],
                        disconnected: [...oldState.disconnected, {label, value: peerCount.disconnected}],
                        disconnecting: [...oldState.disconnecting, {label, value: peerCount.disconnecting}],
                    };
                });
            }
        }, 1000);

        return (): void => {
            canUpdate = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <div className='row space-between'>
            <div className='flex-column'>
                <div className='row space-between' style={{paddingTop: "25px"}}>
                    <h2>Pool</h2>
                </div>

                <div className='beacon-node-charts-container'>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Attestations</div>
                            <div className='graph-title'>
                                {pool.attestations[pool.attestations.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={pool.attestations} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300, marginLeft: "20px"}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Attester slashings</div>
                            <div className='graph-title'>
                                {pool.attesterSlashings[pool.attesterSlashings.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={pool.attesterSlashings} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className='beacon-node-charts-container'>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Voluntary exits</div>
                            <div className='graph-title'>
                                {pool.voluntaryExits[pool.voluntaryExits.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={pool.voluntaryExits} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300, marginLeft: "20px"}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Proposer slashings</div>
                            <div className='graph-title'>
                                {pool.proposerSlashings[pool.proposerSlashings.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={pool.proposerSlashings} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-column'>
                <div className='row space-between' style={{paddingTop: "25px"}}>
                    <h2>Peers</h2>
                </div>

                <div className='beacon-node-charts-container'>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Connected</div>
                            <div className='graph-title'>{peers.connected[peers.connected.length - 1].value || 0}</div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={peers.connected} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Disconnected</div>
                            <div className='graph-title'>
                                {peers.disconnected[peers.disconnected.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={peers.disconnected} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className='beacon-node-charts-container'>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Connecting</div>
                            <div className='graph-title'>
                                {peers.connecting[peers.connecting.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={peers.connecting} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300, marginLeft: "20px"}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Disconnecting</div>
                            <div className='graph-title'>
                                {peers.disconnecting[peers.disconnecting.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={peers.disconnecting} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
