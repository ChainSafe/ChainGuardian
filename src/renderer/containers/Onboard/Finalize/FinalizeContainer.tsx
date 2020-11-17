import React, {useState} from "react";
import {InputForm} from "../../../components/Input/InputForm";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {useHistory} from "react-router-dom";
import {getAuthAccount} from "../../../ducks/auth/selectors";
import {useSelector} from "react-redux";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";

export const FinalizeContainer: React.FC = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [beaconIndex, setBeaconIndex] = useState(0);

    const isFirstTimeRegistration = !useSelector(getAuthAccount);

    const beacons: string[] = [];

    const onSubmit = (): void => {
        if (isFirstTimeRegistration) {
            history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONSENT));
        } else {
            history.push(Routes.DASHBOARD_ROUTE);
        }
    };

    return (
        <>
            <h1>Configure Validator settings</h1>
            <p>You can skip customizing this data if you want to use the default values.</p>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Validator Name</h3>
                </div>
                <InputForm onChange={(e): void => setName(e.currentTarget.value)} inputValue={name} />
            </div>

            <div className='row align-left'>
                <Dropdown label='Beacon Node' current={beaconIndex} onChange={setBeaconIndex} options={beacons} />
            </div>

            <span className='submit-button-container'>
                <ButtonPrimary buttonId='submit' onClick={onSubmit}>
                    Next
                </ButtonPrimary>
            </span>
        </>
    );
};
