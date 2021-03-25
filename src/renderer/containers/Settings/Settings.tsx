import React from "react";
import OnBoardModal from "../Onboard/OnBoardModal";
import {Background} from "../../components/Background/Background";
import {useHistory} from "react-router";

export const Settings: React.FC = () => {
    const history = useHistory();
    return (
        <Background>
            <OnBoardModal history={history} currentStep={0}>
                Settings
            </OnBoardModal>
        </Background>
    );
};