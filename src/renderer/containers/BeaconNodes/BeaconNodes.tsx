import React from "react";
import {useSelector} from "react-redux";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {NodeCard} from "../../components/Cards/NodeCard";
import {BeaconNodeButtons} from "./BeaconNodeButtons";
import {getBeacons} from "../../ducks/beacon/selectors";
import {Link} from "react-router-dom";
import {Routes} from "../../constants/routes";
import {ButtonSecondary} from "../../components/Button/ButtonStandard";
import {BeaconStatus} from "../../ducks/beacon/slice";
import {getValidatorsByBeaconNode} from "../../ducks/validator/selectors";
import {truncatePublicKey} from "../../services/utils/formatting";

export const BeaconNodesContainer: React.FunctionComponent = () => {
    const beacons = useSelector(getBeacons);
    const beaconValidators = useSelector(getValidatorsByBeaconNode);

    return (
        <>
            <Background scrollable={true}>
                <div className='flex-column validator-container beacon-nodes-container'>
                    <div className='row'>
                        <Link to={Routes.DASHBOARD_ROUTE}>
                            <BackButton />
                        </Link>
                        <h2>Beacon nodes management</h2>
                        <Link to={Routes.ADD_BEACON_NODE} className='add-beacon-node'>
                            <ButtonSecondary>ADD BEACON NODE</ButtonSecondary>
                        </Link>
                    </div>

                    <div className='validator-nodes'>
                        <div className='flex-column'>
                            {beacons.keys.length === 0 ? <h3>No beacon nodes found.</h3> : null}

                            {beacons.keys.map((url) => (
                                <div className='row box node-container' key={url}>
                                    <Link to={Routes.BEACON_NODE_DETAILS.replace(":url", encodeURIComponent(url))}>
                                        <NodeCard
                                            onClick={() => (): void => {}}
                                            title={
                                                beacons.beacons[url].docker
                                                    ? "Local Docker container"
                                                    : "Remote Beacon node"
                                            }
                                            url={url}
                                            isSyncing={beacons.beacons[url].status === BeaconStatus.syncing}
                                            value={
                                                beacons.beacons[url].status !== BeaconStatus.offline
                                                    ? beacons.beacons[url].slot
                                                    : "N/A"
                                            }
                                        />
                                    </Link>

                                    <div className='flex-column stretch space-between'>
                                        <div className='flex-column'>
                                            {beaconValidators[url] ? (
                                                <>
                                                    <h5>Connected validators:</h5>
                                                    {beaconValidators[url].map(({name, publicKey}) => (
                                                        <div className='flex-column' key={name}>
                                                            <p>
                                                                <b>{name} </b>- {truncatePublicKey(publicKey)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <h5>No connected validators</h5>
                                            )}
                                        </div>

                                        <BeaconNodeButtons image={beacons.beacons[url].docker?.id} url={url} />
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
