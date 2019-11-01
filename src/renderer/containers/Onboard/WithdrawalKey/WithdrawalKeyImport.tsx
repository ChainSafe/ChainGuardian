import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../components/KeyModalContent/KeyModalContent";
import {
    IMPORT_KEY_PLACEHOLDER, 
    IMPORT_WITHDRAWAL_KEY_TITLE, 
    IMPORT_WITHDRAWAL_KEY_DESCRIPTION
} from "../../../constants/strings";

export default class WithdrawalKeyImport extends Component<{ history: any }, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent
                title={IMPORT_WITHDRAWAL_KEY_TITLE}
                description={IMPORT_WITHDRAWAL_KEY_DESCRIPTION}
                placeholder={IMPORT_KEY_PLACEHOLDER}
                onSubmit={(): any => alert("Submit")}
            />
        );
    }
}
