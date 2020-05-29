import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";

type IOwnProps =  Pick<RouteComponentProps, "history">;
const Configure: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [path, setPath] = useState("");
    const [valid, isValid] = useState(null);

    const savePath = (): void => {

    };

    return (
        <>
            <h1>Configure Docker</h1>
            <p>Docker application not found.</p>

            <div className="input-container">
                <div className="row">
                    <p>
                        Please
                        <a href="https://www.docker.com/products/docker-desktop" target="_blank">
                            install Docker
                        </a> to be able to run beacon node on your PC.
                    </p>
                </div>

                <div className="row">
                    <h5 className="input-or">OR</h5>
                </div>

                <div className="row">
                    <p>Input Docker path: </p><br />

                    <InputForm
                        focused
                        onChange={(e: React.FormEvent<HTMLInputElement>) => setPath(e.currentTarget.value)}
                        type="password"
                        valid={valid}
                        errorMessage={"Incorrect password"}
                    />
                    <ButtonSecondary
                        buttonId="go"
                        onClick={savePath}
                    >
                        Set path
                    </ButtonSecondary>
                </div>
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
