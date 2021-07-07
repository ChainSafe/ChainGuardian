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

const noData: SimpleLineChartRecord[] = new Array(100).fill({label: ""});
export const BeaconNodeMetrics: React.FC<IBeaconNodeProps> = ({beacon: {url}}) => {
    // Pool
    const [attestations, setAttestations] = useState<SimpleLineChartRecord[]>([...noData]);
    const [attesterSlashings, setAttesterSlashings] = useState<SimpleLineChartRecord[]>([...noData]);
    const [voluntaryExits, setVoluntaryExits] = useState<SimpleLineChartRecord[]>([...noData]);
    const [proposerSlashings, setProposerSlashings] = useState<SimpleLineChartRecord[]>([...noData]);

    // Peers
    const [connected, setConnected] = useState<SimpleLineChartRecord[]>([...noData]);
    const [connecting, setConnecting] = useState<SimpleLineChartRecord[]>([...noData]);
    const [disconnected, setDisconnected] = useState<SimpleLineChartRecord[]>([...noData]);
    const [disconnecting, setDisconnecting] = useState<SimpleLineChartRecord[]>([...noData]);

    useEffect(() => {
        let canUpdate = true;
        const interval = setInterval(async () => {
            const label = format(new Date(), "k:mm:ss");

            const ApiClient = await getBeaconNodeEth2ApiClient(url);
            const eth2API = new ApiClient(config, url);

            const poolState = await eth2API.beacon.pool.getPoolStatus();
            const peerCount = await eth2API.node.getPeerCount();

            if (canUpdate) {
                setAttestations((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: poolState.attestations}];
                });
                setAttesterSlashings((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: poolState.attesterSlashings}];
                });
                setVoluntaryExits((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: poolState.voluntaryExits}];
                });
                setProposerSlashings((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: poolState.proposerSlashings}];
                });

                setConnected((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: peerCount.connected}];
                });
                setConnecting((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: peerCount.connecting}];
                });
                setDisconnected((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: peerCount.disconnected}];
                });
                setDisconnecting((oldState) => {
                    oldState.shift();
                    return [...oldState, {label, value: peerCount.disconnecting}];
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
                            <div className='graph-title'>{attestations[attestations.length - 1].value || 0}</div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={attestations} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300, marginLeft: "20px"}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Attester slashings</div>
                            <div className='graph-title'>
                                {attesterSlashings[attesterSlashings.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={attesterSlashings} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className='beacon-node-charts-container'>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Voluntary exits</div>
                            <div className='graph-title'>{voluntaryExits[voluntaryExits.length - 1].value || 0}</div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={voluntaryExits} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300, marginLeft: "20px"}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Proposer slashings</div>
                            <div className='graph-title'>
                                {proposerSlashings[proposerSlashings.length - 1].value || 0}
                            </div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={proposerSlashings} isAnimationActive={false} hideTooltip />
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
                            <div className='graph-title'>{connected[connected.length - 1].value || 0}</div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={connected} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Disconnected</div>
                            <div className='graph-title'>{disconnected[disconnected.length - 1].value || 0}</div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={disconnected} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className='beacon-node-charts-container'>
                    <div className='node-graph-container' style={{width: 300}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Connecting</div>
                            <div className='graph-title'>{connecting[connecting.length - 1].value || 0}</div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={connecting} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='node-graph-container' style={{width: 300, marginLeft: "20px"}}>
                        <div className='graph-header'>
                            <div className='graph-title'>Disconnecting</div>
                            <div className='graph-title'>{disconnecting[disconnecting.length - 1].value || 0}</div>
                        </div>
                        <div className='graph-content'>
                            <ResponsiveContainer width='100%' height={150}>
                                <SimpleLineChart data={disconnecting} isAnimationActive={false} hideTooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
