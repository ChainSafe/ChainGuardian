import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {startBeaconChainAction} from "../../../actions/network";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";
import {Routes} from "../../../constants/routes";
import {IRootState} from "../../../reducers";

type IOwnProps = Pick<RouteComponentProps, "history"> & Pick<IRootState, "network">;
interface IInjectedProps {
    startBeaconChain: typeof startBeaconChainAction;
}

const Configure: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [rpcPort, setRpcPort] = useState("4000");
    const [libp2pPort, setLibp2pPort] = useState("13000");

    const onSubmit = (): void => {
        if (props.network.selected) {
            props.startBeaconChain(props.network.selected, [`${rpcPort}:4000`, `${libp2pPort}:13000`]);
            props.history.push(Routes.DASHBOARD_ROUTE);
        }
    };

    return (
        <>
            <h1>Configure Beacon node settings</h1>
            <p>You can skip customizing this data if you want to use the default values.</p>

            <div className="configure-port">
                <div className="row">
                    <h3>Local RPC port</h3>
                    <p>(default: 4000)</p>
                </div>
                <InputForm
                    onChange={(e):void => setRpcPort(e.currentTarget.value)}
                    inputValue={rpcPort}
                />
            </div>

            <div className="configure-port">
                <div className="row">
                    <h3>Local libp2p port</h3><p>(default: 13000)</p>
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

const mapStateToProps = (state: IRootState): Pick<IRootState, "network"> => ({
    network: state.network,
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            startBeaconChain: startBeaconChainAction,
        },
        dispatch
    );

export const ConfigureBeaconNode= connect(
    mapStateToProps,
    mapDispatchToProps
)(Configure);