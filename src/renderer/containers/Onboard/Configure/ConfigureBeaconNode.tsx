import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {startBeaconChainAction, saveBeaconNodeAction} from "../../../actions/network";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {IRootState} from "../../../reducers";
import {getNetworkConfig} from "../../../services/eth2/networks";

type IStateProps = Pick<IRootState, "register">;
type IOwnProps =  Pick<RouteComponentProps, "history">;
interface IInjectedProps {
    startBeaconChain: typeof startBeaconChainAction;
    saveBeaconNode: typeof saveBeaconNodeAction;
}

const Configure: React.FunctionComponent<IOwnProps & IInjectedProps & IStateProps> = (props) => {
    const {network} = props.register;
    const ports = getNetworkConfig(network).dockerConfig.ports;
    const defaultRpcPort = ports[0].local;
    const [rpcPort, setRpcPort] = useState(defaultRpcPort);
    const defaultLibp2pPort = ports[1].local;
    const [libp2pPort, setLibp2pPort] = useState(ports[1].local);

    const onSubmit = (): void => {
        // Start beacon chain with selected network and redirect to deposit
        if (props.register.network) {
            props.startBeaconChain(network, [{...ports[0], local: rpcPort}, {...ports[1], local: libp2pPort}]);
            props.saveBeaconNode(`http://localhost:${rpcPort}`, props.register.network);
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
        }
    };

    return (
        <>
            <h1>Configure Beacon node settings</h1>
            <p>You can skip customizing this data if you want to use the default values.</p>

            <div className="configure-port">
                <div className="row">
                    <h3>Local RPC port</h3>
                    <p>(default: {defaultRpcPort})</p>
                </div>
                <InputForm
                    onChange={(e): void => setRpcPort(e.currentTarget.value)}
                    inputValue={rpcPort}
                />
            </div>

            <div className="configure-port">
                <div className="row">
                    <h3>Local libp2p port</h3><p>(default: {defaultLibp2pPort})</p>
                </div>
                <InputForm
                    onChange={(e): void => setLibp2pPort(e.currentTarget.value)}
                    inputValue={libp2pPort}
                />
            </div>

            <ButtonPrimary onClick={onSubmit} buttonId="next">NEXT</ButtonPrimary>
        </>
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

export const ConfigureBeaconNode= connect(
    mapStateToProps,
    mapDispatchToProps
)(Configure);
