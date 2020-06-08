import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {ButtonDestructive, ButtonInverted, ButtonPrimary} from "../../components/Button/ButtonStandard";
import {NodeCard} from "../../components/Cards/NodeCard";
import {BeaconNode} from "../../models/beaconNode";
import {IRootState} from "../../reducers";

interface extendedBeaconNode extends BeaconNode {
    validators: string[]
}
type beaconNodes = {
    [url: string]: extendedBeaconNode;
}

export const BeaconNodesContainer: React.FunctionComponent = () => {
    const history = useHistory();
    const validatorBeaconNodes = useSelector((state: IRootState) => state.network.validatorBeaconNodes);

    const allNodes: beaconNodes = {};
    for (let [validatorAddress, beaconNodes] of Object.entries(validatorBeaconNodes)) {
        beaconNodes.map(node => {
            allNodes[node.url] = {
                ...node,
                validators: allNodes[node.url] ? allNodes[node.url].validators : [],
            };
            allNodes[node.url].validators.push(validatorAddress)
        });
    }
    const nodeList = Object.keys(allNodes);

    return (
        <Background scrollable={true}>
            <div className="flex-column validator-container beacon-nodes-container">
                <div className="row">
                    <BackButton onClick={(): void => history.goBack()} />
                    <h2>Beacon nodes management</h2>
                </div>

                <div className="validator-nodes">
                    <div className="flex-column">
                        {nodeList.length === 0 ? <h3>No beacon nodes found.</h3> : null}

                        {nodeList.map((url) => (
                            <div className="flex-column box node-container">
                                <NodeCard
                                    key={url}
                                    onClick={() => (): void => {}}
                                    title={allNodes[url].localDockerId ? "Local Docker container" : "Remote Beacon node"}
                                    url={url}
                                    isSyncing={allNodes[url].isSyncing}
                                    value={allNodes[url].currentSlot || "N/A"}
                                />

                                <h5>Connected validators:</h5>

                                {allNodes[url] && allNodes[url].validators.map(validatorAddress => (
                                    <div className="flex-column" key={validatorAddress}>
                                        <p>{validatorAddress}</p>
                                    </div>
                                ))}

                                <div className="row">
                                    <ButtonDestructive>Remove</ButtonDestructive>
                                    <ButtonPrimary>Start</ButtonPrimary>
                                    <ButtonInverted>Stop</ButtonInverted>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Background>
    );
};
