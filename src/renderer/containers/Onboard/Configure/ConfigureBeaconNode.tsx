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

interface IStateProps extends Pick<IRootState, "register"> {
    pullingDockerImage: boolean;
    finishedPullingDockerImage: boolean;
}
type IOwnProps =  Pick<RouteComponentProps, "history">;
interface IInjectedProps {
    startBeaconChain: typeof startBeaconChain;
}

const Configure: React.FunctionComponent<IOwnProps & IInjectedProps & IStateProps> = (props) => {
    const {network} = props.register;


    const onSubmit = (ports: DockerPort[], libp2pPort: string, rpcPort: string): void => {
        // Start beacon chain with selected network and redirect to deposit
        if (props.register.network) {
            props.startBeaconChain(network, [{...ports[0], local: libp2pPort}, {...ports[1], local: rpcPort}]);
        }
    };

    useEffect(() => {
        if (props.finishedPullingDockerImage) {
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
        }
    }, [props.finishedPullingDockerImage]);

    return (
        <>
            <ConfigureBeaconNode
                network={network}
                onSubmit={onSubmit}
            />
            <Loading visible={props.pullingDockerImage} title="Pulling Docker image..." />
        </>
    );
};


interface IInjectedProps {
    startBeaconChain: typeof startBeaconChain;
}

// TODO: use selectors
const mapStateToProps = (state: IRootState): IStateProps => ({
    register: state.register,
    pullingDockerImage: state.network.pullingDockerImage,
    finishedPullingDockerImage: state.network.finishedPullingDockerImage,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            startBeaconChain,
        },
        dispatch
    );

export const ConfigureBeaconNodeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Configure);
