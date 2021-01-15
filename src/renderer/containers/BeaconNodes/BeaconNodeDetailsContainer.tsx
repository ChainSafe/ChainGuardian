import React from "react";
import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {BeaconNode} from "../BeaconNode/BeaconNode";
import {useHistory, useParams} from "react-router";
import {useSelector} from "react-redux";
import {getBeaconByKey} from "../../ducks/beacon/selectors";
import {IRootState} from "../../ducks/reducers";
import {BeaconNodeButtons} from "./BeaconNodeButtons";

export const BeaconNodeDetailsContainer: React.FC = () => {
    const history = useHistory();
    const {url} = useParams();
    const beacon = useSelector((state: IRootState) => getBeaconByKey(state, {key: decodeURIComponent(url)}));

    return (
        <Background scrollable={true}>
            <div className='flex-column validator-container beacon-node-details-container'>
                <div className='row'>
                    <BackButton onClick={(): void => history.goBack()} />
                    <h2>Beacon node</h2>
                    <h5 className='beacon-url'>{beacon.url}</h5>
                </div>
                <div className='container-scroll-y'>
                    <BeaconNode beacon={beacon} showTitle={false} />

                    {beacon.docker && <BeaconNodeButtons image={beacon.docker.id} url={beacon.url} />}
                </div>
            </div>
        </Background>
    );
};
