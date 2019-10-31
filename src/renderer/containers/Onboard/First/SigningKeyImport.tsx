import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../components/KeyModalContent/KeyModalContent";
import {Routes, Subroutes} from "../../../constants/routes";

export default class SigningKeyImport extends Component<{ history: any }, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent title="Enter your signing key" onSubmit={this.handleSubmit} />
        );
    }

    private handleSubmit= (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(Subroutes.WITHDRAWAL, Subroutes.WITHDRAWAL_IMPORT));
    };

}
