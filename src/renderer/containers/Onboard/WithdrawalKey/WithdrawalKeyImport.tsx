import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../components/KeyModalContent/KeyModalContent";
import {
    IMPORT_WITHDRAWAL_KEY_TITLE, 
    IMPORT_WITHDRAWAL_KEY_DESCRIPTION,
    IMPORT_WITHDRAWAL_KEY_PLACEHOLDER
} from "../../../constants/strings";
import {History} from "history";
import {publicKeySchema} from "./validation";
import {ValidationResult} from "@hapi/joi";


export default class WithdrawalKeyImport extends Component<{ history: History }, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent
                title={IMPORT_WITHDRAWAL_KEY_TITLE}
                description={IMPORT_WITHDRAWAL_KEY_DESCRIPTION}
                placeholder={IMPORT_WITHDRAWAL_KEY_PLACEHOLDER}
                onSubmit={(): any => console.log("Submit")}
                validate={(input: string): ValidationResult => {
                    return publicKeySchema.validate(input);
                }}
            />
        );
    }
}
