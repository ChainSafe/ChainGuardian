import React from "react";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {NodeCard} from "../../components/Cards/NodeCard";

export const BeaconNodesContainer: React.FunctionComponent = () => {
    const history = useHistory();

    const nodes = [
        {
            url: "Localhost",
            localDockerId: "Ma ja",
            isSyncing: true,
            currentSlot: 0,
        }
    ];

    return (
        <Background scrollable={true}>
            <div className="flex-column stretch validator-container">
                <div className="row">
                    <BackButton onClick={(): void => history.goBack()} />
                    <h1>Beacon nodes management</h1>
                </div>

                <div className="validator-nodes">
                    <div className="box node-container">
                        <div className="node-grid-container">
                            {nodes.length === 0 ? <p>No working beacon nodes.</p> : null}

                            {nodes.map(node => {
                                return (
                                    <NodeCard
                                        key={node.url}
                                        //TODO: change to some other id when multinode is enabled
                                        onClick={() => (): void => {}}
                                        title={node.localDockerId ? "Local Docker container" : "Remote Beacon node"}
                                        url={node.url}
                                        isSyncing={node.isSyncing}
                                        value={node.currentSlot || "N/A"}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};
