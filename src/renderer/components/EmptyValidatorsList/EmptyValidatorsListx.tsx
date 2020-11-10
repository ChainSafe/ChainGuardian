import React, {ReactElement} from "react";
import {useHistory} from "react-router";
import {OnBoardingRoutes, Routes} from "../../constants/routes";
import {ButtonPrimary} from "../Button/ButtonStandard";

export const EmptyValidatorsList = (): ReactElement => {
    const history = useHistory();

    const onCreateValidator = (): void => {
        history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    };

    return (
        <div className='validator-container'>
            <div className='box empty-list'>
                <div className='flex-column centered'>
                    <h2>No validators found.</h2>
                    <p>Please create new account to start using ChainGuardian.</p>
                </div>

                <ButtonPrimary onClick={onCreateValidator} buttonId={"add-validator"}>
                    CREATE VALIDATOR
                </ButtonPrimary>
            </div>
        </div>
    );
};
