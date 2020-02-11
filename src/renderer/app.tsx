import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {AppContainer} from "react-hot-loader";
import {NotificationRenderer} from "./NotificationRenderer";
import Application from "./containers/Application";
import store from "./store";
import "./style/index.scss";

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
            </Provider>
        </AppContainer>,
        mainElement
    );
};

render(Application);
