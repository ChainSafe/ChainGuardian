import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {NodeCard} from "../../components/Cards/NodeCard";
import {BeaconNodeButtons} from "./BeaconNodeButtons";
import {getBeacons} from "../../ducks/beacon/selectors";

export const BeaconNodesContainer: React.FunctionComponent = () => {
    const history = useHistory();
    const beacons = useSelector(getBeacons);

    return (
        <>
            <Background scrollable={true}>
                <div className='flex-column validator-container beacon-nodes-container'>
                    <div className='row'>
                        <BackButton onClick={(): void => history.goBack()} />
                        <h2>Beacon nodes management</h2>
                    </div>

                    <div className='validator-nodes'>
                        <div className='flex-column'>
                            {beacons.keys.length === 0 ? <h3>No beacon nodes found.</h3> : null}

                            {beacons.keys.map((url) => (
                                <div className='row box node-container' key={url}>
                                    <NodeCard
                                        onClick={() => (): void => {}}
                                        title={
                                            beacons.beacons[url].localDockerId
                                                ? "Local Docker container"
                                                : "Remote Beacon node"
                                        }
                                        url={url}
                                        isSyncing={false}
                                        value='N/A'
                                    />

                                    <div className='flex-column stretch space-between'>
                                        {/*TODO: implement validator list linked on beacon*/}
                                        <div className='flex-column'>
                                            <h5>Connected validators:</h5>
                                        </div>

                                        <BeaconNodeButtons image={beacons.beacons[url].localDockerId} url={url} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Background>
        </>
    );
};
