import {hot} from "react-hot-loader/root";
import * as React from "react";
import CounterContainer from "../containers/CounterContainer";
import {ReactElement} from "react";
import LoginContainer from "../containers/LoginContainer"

const Application = (): ReactElement => (
        <LoginContainer />
);

export default hot(Application);
