import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {NodeCard} from "../../components/Cards/NodeCard";
import {IValidatorBeaconNodes} from "../../models/beaconNode";
import {IRootState} from "../../reducers";

export const BeaconNodesContainer: React.FunctionComponent = () => {
    const history = useHistory();
    const validatorBeaconNodes = useSelector((state: IRootState) => state.network.validatorBeaconNodes);
    const validators = Object.keys(validatorBeaconNodes);

    return (
        <Background scrollable={true}>
            <div className="flex-column stretch validator-container">
                <div className="row">
                    <BackButton onClick={(): void => history.goBack()} />
                    <h2>Beacon nodes management</h2>
                </div>

                <div className="validator-nodes">
                    <div className="box node-container">
                        <div className="node-grid-container">
                            {validators.length === 0 ? <h3>No beacon nodes found.</h3> : null}

                            {validators.map((validatorAddress, index) => (
                                validatorBeaconNodes[validatorAddress].map(node => (
                                    <div className="flex-column">
                                        <h4>Validator {index+1}</h4>
                                        <p>{validatorAddress}</p>
                                        <NodeCard
                                            key={node.url}
                                            onClick={() => (): void => {}}
                                            title={node.localDockerId ? "Local Docker container" : "Remote Beacon node"}
                                            url={node.url}
                                            isSyncing={node.isSyncing}
                                            value={node.currentSlot || "N/A"}
                                        />
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};
