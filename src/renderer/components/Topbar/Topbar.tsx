import React, {ReactElement} from "react";
import {useHistory} from "react-router";
import {OnBoardingRoutes, Routes} from "../../constants/routes";

import {ButtonPrimary, ButtonSecondary} from "../Button/ButtonStandard";
import {NetworkDropdown} from "../NetworkDropdown/NetworkDropdown";


export const Topbar = (): ReactElement => {
    const history = useHistory();

    const onAddNewValidator = (): void => {
        history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    };

    const onBeaconNodesClick = (): void => {
        history.push(Routes.BEACON_NODES);
    };

    return (
        <div className={"validator-top-bar"}>
            <NetworkDropdown/>

            <ButtonSecondary onClick={onBeaconNodesClick}>
                BEACON NODES
            </ButtonSecondary>

            <ButtonPrimary onClick={onAddNewValidator} buttonId={"add-validator"}>
                ADD NEW VALIDATOR
            </ButtonPrimary>
        </div>
    );
};
