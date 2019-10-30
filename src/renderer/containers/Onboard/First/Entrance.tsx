import React, {ReactElement} from "react";
import {Link} from "react-router-dom";
import {ButtonSecondary, ButtonPrimary} from "../../../components/Button/ButtonStandard";
import { Routes } from "../../../constants/routes";

export default function Entrance(): ReactElement {
    return (
        <>
            <h1>Enter your signing key</h1>
            <p>You’ll need this for signing blocks and attestations on your behalf</p>
            <div className="action-buttons">
                <Link to={Routes.ONBOARD_ROUTE_EVALUATE('1', 'a1')}>
                    <ButtonSecondary buttonId="import" large>IMPORT</ButtonSecondary>
                </Link>
                <ButtonPrimary buttonId="generate" large>GENERATE</ButtonPrimary>
            </div>
        </>
    );
}
