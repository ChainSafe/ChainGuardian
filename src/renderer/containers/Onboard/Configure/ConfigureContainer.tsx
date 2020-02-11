import React, { Component, ReactElement, useState } from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import { startBeaconChainAction } from '../../../actions/network';
import { ButtonPrimary, ButtonPrimitive, ButtonSecondary } from '../../../components/Button/ButtonStandard';
import { InputForm } from '../../../components/Input/InputForm';

type IOwnProps = Pick<RouteComponentProps, 'history'>;

const Configure: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [beaconNodeInput, setBeaconNodeInput] = useState("");

    const onBeaconNodeInput = (e: React.FormEvent<HTMLInputElement>): void => {
        setBeaconNodeInput(e.currentTarget.value);
        // TODO: Validate beacon node here
    };

    return (
        <>
            <h1>Add your beacon node URL</h1>
            <p>Either add the URL or run a dockerized beacon node on your device.</p>

            <div className="action-buttons">
                <InputForm
                    focused
                    onChange={onBeaconNodeInput}
                    inputValue={beaconNodeInput}
                    placeholder="Enter beacon node URL"
                />

                <ButtonSecondary>GO</ButtonSecondary>
            </div>

            <h5 className="input-or">OR</h5>

            <ButtonPrimary>RUN OWN NODE</ButtonPrimary>
            <div className="skip-notes" >This requires a docker installed. We will run a dockerized beacon node on your device.</div>
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

export const ConfigureContainer = connect(
    null,
    mapDispatchToProps
)(Configure);