import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../components/KeyModalContent/KeyModalContent";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";
import {IMPORT_SIGNING_KEY_TITLE, IMPORT_SIGNING_KEY_PLACEHOLDER} from "../../../constants/strings";
import {History} from "history";

export default class SigningKeyImport extends Component<{ history: History }, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent 
                title={IMPORT_SIGNING_KEY_TITLE}
                onSubmit={this.handleSubmit}
                placeholder={IMPORT_SIGNING_KEY_PLACEHOLDER}
                signing={true} 
            />
        );
    }

    private handleSubmit= (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL_IMPORT));
    };

}
