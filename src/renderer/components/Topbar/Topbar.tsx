import React, {ReactElement} from "react";
import {useHistory} from "react-router";
import {OnBoardingRoutes, Routes} from "../../constants/routes";

import {ButtonPrimary} from "../Button/ButtonStandard";
import {NetworkDropdown} from "../NetworkDropdown/NetworkDropdown";

interface ITopbarProps {
    hideButton: boolean;
}

export const Topbar = ({hideButton}: ITopbarProps): ReactElement => {
    const history = useHistory();
    const onAddNewValidator = (): void => {
        history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    };

    return (
        <div className={"validator-top-bar"}>
            <NetworkDropdown/>

            {hideButton ? null :
                <ButtonPrimary onClick={onAddNewValidator} buttonId={"add-validator"}>
                    ADD NEW VALIDATOR
                </ButtonPrimary>
            }
        </div>
    );
};
