import {hot} from "react-hot-loader/root";
import * as React from "react";
import {ReactElement} from "react";
import LoginContainer from "../containers/LoginContainer";

const Application = (): ReactElement => (
    <LoginContainer />
);

export default hot(Application);
