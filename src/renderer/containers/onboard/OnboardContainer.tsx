import React, {Component, ReactElement} from "react";
import {Background} from "../../components/Background/Background";
import OnBoardModal from "./OnBoardModal";
import KeyInput from "../../components/KeyModalContent/KeyModalContent";
import Entrance from "./first/Entrance";

const Steper = {
    "1": {
        "0": <Entrance />,
        "a1": <KeyInput title="Enter your signing key" onSubmit={(): any => alert("Submit")}/>
    }
};

export default class OnboardContainer extends Component<{ history: any, match: any }, {}> {
    
    public render(): ReactElement {
        const {step} = this.props.match.params;
        return (
            <Background>
                <OnBoardModal history={this.props.history} currentStep={parseInt(step)}>
                    {this.renderStep()}
                </OnBoardModal>
            </Background >
        );
    }

    private renderStep = (): any => {
        const {step, substep} = this.props.match.params;
        return (Steper as any)[step][substep];
    };
}
