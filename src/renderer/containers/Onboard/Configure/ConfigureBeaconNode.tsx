import React, { useState } from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import { startBeaconChainAction } from '../../../actions/network';
import { ButtonPrimary} from '../../../components/Button/ButtonStandard';
import { InputForm } from '../../../components/Input/InputForm';
import { Routes } from '../../../constants/routes';

type IOwnProps = Pick<RouteComponentProps, 'history'>;

const Configure: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [rpcPort, setRpcPort] = useState("4000");
    const [libp2pPort, setLibp2pPort] = useState("13000");

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
                    onChange={(e) => setRpcPort(e.currentTarget.value)}
                    inputValue={rpcPort}
                />
            </div>

            <div className="configure-port">
                <div className="row">
                    <h3>Local libp2p port</h3><p>(default: 13000)</p>
                </div>
                <InputForm
                    onChange={(e) => setLibp2pPort(e.currentTarget.value)}
                    inputValue={libp2pPort}
                />
            </div>

            <Link to={Routes.DASHBOARD_ROUTE}>
                <ButtonPrimary buttonId="next">NEXT</ButtonPrimary>
            </Link>
        </>
    );
};


interface IInjectedProps {
    startBeaconChain: typeof startBeaconChainAction;
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            startBeaconChain: startBeaconChainAction,
        },
        dispatch
    );

export const ConfigureBeaconNode= connect(
    null,
    mapDispatchToProps
)(Configure);