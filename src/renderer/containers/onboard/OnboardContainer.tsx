import React, { Component } from 'react'
import { Background } from '../../components/Background/Background'
import { Modal } from '../../components/Modal/Modal'
import { Link } from 'react-router-dom'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button/ButtonStandard'
import { BackTab } from '../../components/Button/ButtonAction'

export default class OnboardContainer extends Component {
    render() {
        return (
            <Background>
                <div className="back-tab-wrapper">
                    <Link to="/">
                        <BackTab />
                    </Link>
                </div>
                <Modal>
                    <h1>Enter your signing key</h1>
                    <p>You’ll need this for signing blocks and attestations on your behalf</p>
                    <div className="action-buttons">
                        <ButtonSecondary large>IMPORT</ButtonSecondary>
                        <ButtonPrimary large>GENERATE</ButtonPrimary>
                    </div>
                </Modal>
            </Background >
        )
    }
}
