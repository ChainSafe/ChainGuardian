import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {remote} from "electron";

import {saveAccountSettings} from "../../../actions/settings";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {DockerPath} from "../../../services/docker/path";

type IOwnProps =  Pick<RouteComponentProps, "history">;
const Configure: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [path, setPath] = useState("");
    const [valid, setValid] = useState(null);

    const savePath = async(): Promise<void> => {
        const {filePaths} = await remote.dialog.showOpenDialog({
            title:"Select Docker binary",
            properties: ['openFile']
        });
        setPath(filePaths[0]);

        if (filePaths[0] && await DockerPath.isValidPath(filePaths[0])) {
            props.saveSettings({
                dockerPath: filePaths[0],
            });
            setValid(true);
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_BEACON_NODE));
        } else {
            setValid(false);
        }
    };

    return (
        <>
            <h1>Docker application not found</h1><br />

            <p>
                Please
                <a href="https://www.docker.com/products/docker-desktop"
                    target="_blank" rel="noopener noreferrer"> install Docker </a>
                to be able to run beacon node on your PC.
            </p>

            <h5 className="input-or">OR</h5>

            <p>Input Docker path: </p>

            <div className="flex-column">
                <div className="action-buttons no-margin">
                    <InputForm
                        focused
                        readOnly
                        inputValue={path}
                        valid={valid}
                        errorMessage={"Invalid path"}
                    />
                    <ButtonSecondary
                        buttonId="go"
                        onClick={savePath}
                    >
                        Choose
                    </ButtonSecondary>
                </div>

                <ButtonPrimary
                    buttonId="next"
                    disabled={!valid}
                    type="submit"
                >
                    NEXT
                </ButtonPrimary>
            </div>
        </>
    );
};


interface IInjectedProps {
    saveSettings: typeof saveAccountSettings,
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            saveSettings: saveAccountSettings,
        },
        dispatch
    );

export const ConfigureDockerPath = connect(
    null,
    mapDispatchToProps
)(Configure);
