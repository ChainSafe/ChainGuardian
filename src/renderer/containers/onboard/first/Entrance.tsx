import React from 'react'
import {Link} from "react-router-dom";
import { ButtonSecondary, ButtonPrimary } from '../../../components/Button/ButtonStandard'

export default function Entrance() {
    return (
        <>
            <h1>Enter your signing key</h1>
            <p>You’ll need this for signing blocks and attestations on your behalf</p>
            <div className="action-buttons">
                <Link to='/onboard/1/a1'>
                    <ButtonSecondary buttonId="import" large>IMPORT</ButtonSecondary>
                </Link>
                <ButtonPrimary buttonId="generate" large>GENERATE</ButtonPrimary>
            </div>
        </>
    )
}
