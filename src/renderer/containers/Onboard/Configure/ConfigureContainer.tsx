import React, { useState } from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import { ButtonPrimary, ButtonSecondary } from '../../../components/Button/ButtonStandard';
import { InputForm } from '../../../components/Input/InputForm';
import { OnBoardingRoutes, Routes } from '../../../constants/routes';

type IOwnProps = Pick<RouteComponentProps, 'history'>;

export const ConfigureContainer: React.FunctionComponent<IOwnProps> = (props) => {
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

            <Link to={Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_BEACON_NODE)}>
                <ButtonPrimary>RUN OWN NODE</ButtonPrimary>
            </Link>
            <div className="skip-notes" >This requires a docker installed. We will run a dockerized beacon node on your device.</div>
        </>
    );
};
