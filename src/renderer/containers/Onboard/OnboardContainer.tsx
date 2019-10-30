import React, {Component, ReactElement} from "react";
import {Background} from "../../components/Background/Background";
import OnBoardModal from "./OnBoardModal";
import Entrance from "./First/Entrance";
import SigningKeyImport from "./First/SigningKeyImport";
import PublicKeyImport from "./Second/PublicKeyImport";


export default class OnboardContainer extends Component<{ history: any, match: any }, {}> {

    private Steper = {
        "1": {
            "0": <Entrance />,
            "a1": <SigningKeyImport history={this.props.history}/>,
        },
        "2": {
            "b1": <PublicKeyImport history={this.props.history} />
        }
    };
    
    
    public render(): ReactElement {
        const {step} = this.props.match.params;
        return (
            <Background>
                <OnBoardModal history={this.props.history} currentStep={parseInt(step)}>
                    {this.renderStep()}
                </OnBoardModal>
            </Background>
        );
    }

    private renderStep = (): any => {
        const {step, substep} = this.props.match.params;
        return (this.Steper as any)[step][substep];
    };
}
