import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {startBeaconChainAction, saveBeaconNodeAction} from "../../../actions/network";
import {ConfigureBeaconNode} from "../../../components/ConfigureBeaconNode/ConfigureBeaconNode";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {IRootState} from "../../../reducers";
import {DockerPort} from "../../../services/docker/type";

type IStateProps = Pick<IRootState, "register">;
type IOwnProps =  Pick<RouteComponentProps, "history">;
interface IInjectedProps {
    startBeaconChain: typeof startBeaconChainAction;
    saveBeaconNode: typeof saveBeaconNodeAction;
}

const Configure: React.FunctionComponent<IOwnProps & IInjectedProps & IStateProps> = (props) => {
    const {network} = props.register;


    const onSubmit = (ports: DockerPort[], libp2pPort: string, rpcPort: string): void => {
        // Start beacon chain with selected network and redirect to deposit
        if (props.register.network) {
            props.startBeaconChain(network, [{...ports[0], local: libp2pPort}, {...ports[1], local: rpcPort}]);
            props.saveBeaconNode(`http://localhost:${rpcPort}`, props.register.network);
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
        }
    };

    return (
        <ConfigureBeaconNode
            network={network}
            onSubmit={onSubmit}
        />
    );
};


interface IInjectedProps {
    startBeaconChain: typeof startBeaconChainAction;
}

const mapStateToProps = (state: IRootState): IStateProps => ({
    register: state.register,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            startBeaconChain: startBeaconChainAction,
            saveBeaconNode: saveBeaconNodeAction,
        },
        dispatch
    );

export const ConfigureBeaconNodeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Configure);
