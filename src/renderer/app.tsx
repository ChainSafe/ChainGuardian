import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {AppContainer} from "react-hot-loader";
import {init as initBLS} from "@chainsafe/bls";

import {initSentry} from "../main/sentry";
import {NotificationRenderer} from "./NotificationRenderer";
import Application from "./containers/Application";
import "./style/index.scss";
import store from "./ducks/store";
import logger from "electron-log";
import {DockerDemonNotificator} from "./DockerDemonNotificator";

initSentry();

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element): void => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
                <NotificationRenderer />
                <DockerDemonNotificator />
            </Provider>
        </AppContainer>,
        mainElement,
    );
};

initBLS("herumi")
    .then(() => {
        render(Application);
    })
    .catch((e) => logger.error(e));
