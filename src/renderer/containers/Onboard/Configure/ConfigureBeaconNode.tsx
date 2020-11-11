import React, {useEffect} from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";

import {ConfigureBeaconNode} from "../../../components/ConfigureBeaconNode/ConfigureBeaconNode";
import {Loading} from "../../../components/Loading/Loading";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {DockerPort} from "../../../services/docker/type";
import {IRootState} from "../../../ducks/reducers";
import {startBeaconChain} from "../../../ducks/network/actions";
import {getRegisterNetwork} from "../../../ducks/register/selectors";
import {getFinishedPullingDockerImage, getPullingDockerImage} from "../../../ducks/network/selectors";

interface IStateProps {
    network: string;
    pullingDockerImage: boolean;
    finishedPullingDockerImage: boolean;
}
type IOwnProps = Pick<RouteComponentProps, "history">;
interface IInjectedProps {
    startBeaconChain: typeof startBeaconChain;
}

const Configure: React.FunctionComponent<IOwnProps & IInjectedProps & IStateProps> = (props) => {
    const onSubmit = (ports: DockerPort[], libp2pPort: string, rpcPort: string): void => {
        // Start beacon chain with selected network and redirect to deposit
        if (props.network) {
            props.startBeaconChain(props.network, [
                {...ports[0], local: libp2pPort},
                {...ports[1], local: rpcPort},
            ]);
        }
    };

    useEffect(() => {
        if (props.finishedPullingDockerImage) {
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
        }
    }, [props.finishedPullingDockerImage]);

    return (
        <>
            <ConfigureBeaconNode network={props.network} onSubmit={onSubmit} />
            <Loading visible={props.pullingDockerImage} title='Pulling Docker image...' />
        </>
    );
};

interface IInjectedProps {
    startBeaconChain: typeof startBeaconChain;
}

const mapStateToProps = (state: IRootState): IStateProps => ({
    network: getRegisterNetwork(state),
    pullingDockerImage: getPullingDockerImage(state),
    finishedPullingDockerImage: getFinishedPullingDockerImage(state),
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            startBeaconChain,
        },
        dispatch,
    );

export const ConfigureBeaconNodeContainer = connect(mapStateToProps, mapDispatchToProps)(Configure);
