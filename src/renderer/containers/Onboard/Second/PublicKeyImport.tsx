import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../components/KeyModalContent/KeyModalContent";

export default class PublicKeyImport extends Component<{ history: any }, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent
                title="Enter your public key"
                description="We only require a public key so that we can generate deposit transaction."
                onSubmit={(): any => alert("Submit")}
            />
        );
    }
}
