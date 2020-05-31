import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {saveAccountSettings} from "../../../actions/settings";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {DockerPath} from "../../../services/docker/path";

type IOwnProps =  Pick<RouteComponentProps, "history">;
const Configure: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [path, setPath] = useState("");
    const [valid, setValid] = useState(null);

    const savePath = async(): Promise<void> => {
        if (await DockerPath.isValidPath(path)) {
            props.saveSettings({
                dockerPath: path,
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

            <div className="action-buttons no-margin">
                <InputForm
                    focused
                    onChange={(e: React.FormEvent<HTMLInputElement>): void => setPath(e.currentTarget.value)}
                    valid={valid}
                    errorMessage={"Incorrect password"}
                />
                <ButtonPrimary
                    buttonId="go"
                    onClick={savePath}
                >
                    Set path
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
