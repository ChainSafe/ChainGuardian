import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {NodeCard} from "../../components/Cards/NodeCard";
import {Loading} from "../../components/Loading/Loading";
import {BeaconNode} from "../../models/beaconNode";
import {DockerRegistry} from "../../services/docker/docker-registry";
import {truncatePublicKey} from "../../services/utils/formatting";
import {BeaconNodeButtons} from "./BeaconNodeButtons";
import {IRootState} from "../../ducks/reducers";

interface IExtendedBeaconNode extends BeaconNode {
    validators: string[]
}
type BeaconNodes = {
    [url: string]: IExtendedBeaconNode;
};

type RunningBeaconNodes = {
    [url: string]: boolean,
};

export const BeaconNodesContainer: React.FunctionComponent = () => {
    const history = useHistory();
    // TODO: use selectors
    const validatorBeaconNodes = useSelector((state: IRootState) => state.network.validatorBeaconNodes);
    const validators = useSelector((state: IRootState) => state.validators.byPublicKey);

    const [loading, setLoading] = useState<boolean>(true);
    const [runningBeaconNodes, setRunningBeaconNodes] = useState<RunningBeaconNodes>({});
    const [allNodes, setAllNodes] = useState<BeaconNodes>({});
    const nodeList = Object.keys(allNodes);

    useEffect(() => {
        setLoading(true);
        // Parse beacon nodes from all validators
        for (const [validatorAddress, beaconNodes] of Object.entries(validatorBeaconNodes)) {
            const beaconNodesList: BeaconNodes = {};
            beaconNodes.map(node => {
                const validators = allNodes[node.url] ? allNodes[node.url].validators : [];
                validators.push(validatorAddress);
                beaconNodesList[node.url] = {
                    ...node,
                    validators: [...new Set(validators)],
                };
            });
            setAllNodes(beaconNodesList);
        }
        setLoading(false);
    }, [validatorBeaconNodes]);

    useEffect(() => {
        setLoading(true);
        // Load containers running status
        nodeList.map(async (url) => {
            if (allNodes[url].localDockerId) {
                const container = DockerRegistry.getContainer(allNodes[url].localDockerId);
                if (container) {
                    const isRunning = await container.isRunning();
                    setRunningBeaconNodes({
                        ...runningBeaconNodes,
                        [url]: isRunning
                    });
                }
            }
        });
        setLoading(false);
    }, [allNodes]);

    const onUpdateNodeStatus = (url: string, status: boolean): void => {
        setRunningBeaconNodes({
            ...runningBeaconNodes,
            [url]: status
        });
    };

    return (
        <>
            <Background scrollable={true}>
                <div className="flex-column validator-container beacon-nodes-container">
                    <div className="row">
                        <BackButton onClick={(): void => history.goBack()} />
                        <h2>Beacon nodes management</h2>
                    </div>

                    <div className="validator-nodes">
                        <div className="flex-column">
                            {nodeList.length === 0 ? <h3>No beacon nodes found.</h3> : null}

                            {nodeList.map((url) => {
                                const node = allNodes[url];
                                return (
                                    <div className="row box node-container" key={url}>
                                        <NodeCard
                                            onClick={() => (): void => {}}
                                            title={node.localDockerId ? "Local Docker container" : "Remote Beacon node"}
                                            url={url}
                                            isSyncing={node.isSyncing}
                                            value={node.currentSlot || "N/A"}
                                        />

                                        <div className="flex-column stretch space-between">
                                            <div className="flex-column">
                                                <h5>Connected validators:</h5>

                                                {node && node.validators.map(validatorAddress => (
                                                    <div className="flex-column" key={validatorAddress}>
                                                        <p><b>{validators[validatorAddress].name} </b>
                                                            - {truncatePublicKey(validatorAddress)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <BeaconNodeButtons
                                                updateNodeStatus={onUpdateNodeStatus}
                                                image={node.localDockerId}
                                                url={url}
                                                isRunning={runningBeaconNodes[url]}
                                                validators={node.validators}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Background>

            <Loading visible={loading} title="Loading" />
        </>
    );
};
