import React from "react";
import {RouteComponentProps} from "react-router-dom";
import {InputBeaconNode} from "../../../components/ConfigureBeaconNode/InputBeaconNode";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {Container} from "../../../services/docker/container";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {IRootState} from "../../../ducks/reducers";
import {setNetwork} from "../../../ducks/register/actions";
import {saveBeaconNode} from "../../../ducks/network/actions";

type IStateProps = {
    network: string;
};
type IOwnProps = Pick<RouteComponentProps, "history">;
interface IInjectedProps {
    setNetwork: typeof setNetwork;
    saveBeaconNode: typeof saveBeaconNode;
}

const ConfigureContainerComponent: React.FunctionComponent<IOwnProps & IInjectedProps & IStateProps> = (props) => {
    const onRunNodeSubmit = async(network: string): Promise<void> => {
        props.setNetwork(network);

        if (await Container.isDockerInstalled()) {
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_BEACON_NODE));
        } else {
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_DOCKER_PATH));
        }
    };


    const onGoSubmit = async(beaconNodeInput: string, network: string): Promise<void> => {
        props.saveBeaconNode(beaconNodeInput);
        props.setNetwork(network);
        props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
    };

    return (
        <InputBeaconNode
            onGoSubmit={onGoSubmit}
            onRunNodeSubmit={onRunNodeSubmit}
        />
    );
};

const mapStateToProps = (state: IRootState): IStateProps => ({
    // TODO: use selector
    network: state.register.network,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            setNetwork: setNetwork,
            saveBeaconNode: saveBeaconNode,
        },
        dispatch
    );

export const ConfigureContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfigureContainerComponent);
