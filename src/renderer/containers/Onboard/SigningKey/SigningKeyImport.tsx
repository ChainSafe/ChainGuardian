import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../components/KeyModalContent/KeyModalContent";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";
import {IMPORT_KEY_PLACEHOLDER, IMPORT_SIGNING_KEY_TITLE} from "../../../constants/strings";

export default class SigningKeyImport extends Component<{ history: any }, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent 
                title={IMPORT_SIGNING_KEY_TITLE}
                onSubmit={this.handleSubmit}
                placeholder={IMPORT_KEY_PLACEHOLDER} 
            />
        );
    }

    private handleSubmit= (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL_IMPORT));
    };

}
