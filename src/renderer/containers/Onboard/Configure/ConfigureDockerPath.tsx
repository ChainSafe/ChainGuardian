import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";

type IOwnProps =  Pick<RouteComponentProps, "history">;
const Configure: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [path, setPath] = useState("");
    const [valid, isValid] = useState(null);

    const savePath = (): void => {

    };

    return (
        <>
            <h1>Docker application not found</h1><br />

            <p>
                Please
                <a href="https://www.docker.com/products/docker-desktop" target="_blank"> install Docker </a>
                to be able to run beacon node on your PC.
            </p>

            <h5 className="input-or">OR</h5>

            <p>Input Docker path: </p>

            <div className="action-buttons no-margin">
                <InputForm
                    focused
                    onChange={(e: React.FormEvent<HTMLInputElement>) => setPath(e.currentTarget.value)}
                    type="password"
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
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
        },
        dispatch
    );

export const ConfigureDockerPath = connect(
    null,
    mapDispatchToProps
)(Configure);
