import React, { Component, ReactElement } from "react";
import { Background } from "../../components/Background/Background";
import OnBoardModal from "./OnBoardModal";
import Entrance from "./First/Entrance";
import SigningKeyImport from "./First/SigningKeyImport";
import PublicKeyImport from "./Second/PublicKeyImport";
import { Subroutes } from "../../constants/routes";

export default class OnboardContainer extends Component<{ history: any, match: any }, {}> {

    private Steper = {
        [Subroutes.SIGNING]: {
            [Subroutes.SIGNING_ENTRANCE]: <Entrance />,
            [Subroutes.SIGNING_IMPORT]: <SigningKeyImport history={this.props.history} />,
        },
        [Subroutes.WITHDRAWAL]: {
            [Subroutes.WITHDRAWAL_IMPORT]: <PublicKeyImport history={this.props.history} />
        }
    };


    public render(): ReactElement {
        const { step } = this.props.match.params;
        return (
            <Background>
                <OnBoardModal history={this.props.history} currentStep={parseInt(step)}>
                    {this.renderStep()}
                </OnBoardModal>
            </Background>
        );
    }

    private renderStep = (): any => {
        const { step, substep } = this.props.match.params;
        return (this.Steper as any)[step][substep];
    };
}
