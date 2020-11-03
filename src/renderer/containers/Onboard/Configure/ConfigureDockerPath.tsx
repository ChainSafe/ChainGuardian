import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {useDispatch} from "react-redux";
import {remote} from "electron";

import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {DockerPath} from "../../../services/docker/path";
import {saveAccountSettings} from "../../../ducks/settings/actions";

type IOwnProps =  Pick<RouteComponentProps, "history">;
export const ConfigureDockerPath: React.FunctionComponent<IOwnProps> = (props) => {
    const [path, setPath] = useState("");
    const [valid, setValid] = useState(null);
    const dispatch = useDispatch();

    const savePath = async(): Promise<void> => {
        const {filePaths} = await remote.dialog.showOpenDialog({
            title:"Select Docker binary",
            properties: ["openFile"]
        });

        if (filePaths[0]) {
            setPath(filePaths[0]);

            if (filePaths[0] && await DockerPath.isValidPath(filePaths[0])) {
                dispatch(saveAccountSettings({dockerPath: filePaths[0]}));
                setValid(true);
            } else {
                setValid(false);
            }
        }
    };

    const onNextClick = (): void => {
        props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_BEACON_NODE));
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

            <div className="input-container">
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
                        className="no-margin"
                    >
                        Choose
                    </ButtonSecondary>
                </div>
            </div>

            <ButtonPrimary
                buttonId="next"
                disabled={!valid}
                type="submit"
                onClick={onNextClick}
            >
                NEXT
            </ButtonPrimary>
        </>
    );
};
