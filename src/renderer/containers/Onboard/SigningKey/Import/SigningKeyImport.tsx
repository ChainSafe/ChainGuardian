import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../../components/KeyModalContent/KeyModalContent";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";
import {IMPORT_SIGNING_KEY_TITLE, IMPORT_SIGNING_KEY_PLACEHOLDER} from "../../../../constants/strings";
import {History} from "history";
import {mnemonicSchema, privateKeySchema} from "./validation";
import {ValidationResult} from "@hapi/joi";


export class SigningKeyImport extends Component<{ history: History }, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent 
                title={IMPORT_SIGNING_KEY_TITLE}
                onSubmit={this.handleSubmit}
                placeholder={IMPORT_SIGNING_KEY_PLACEHOLDER}
                validate={(input: string): ValidationResult => {
                    const schema = input.startsWith("0x") ? privateKeySchema : mnemonicSchema;
                    return schema.validate(input);
                }}
            />
        );
    }

    private handleSubmit= (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL_IMPORT));
    };

}
