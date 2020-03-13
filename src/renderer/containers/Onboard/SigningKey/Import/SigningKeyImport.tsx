import React, {Component, ReactElement} from "react";
import {RouteComponentProps} from "react-router-dom";
import KeyModalContent from "../../../../components/KeyModalContent/KeyModalContent";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";
import {IMPORT_SIGNING_KEY_TITLE, IMPORT_SIGNING_KEY_PLACEHOLDER} from "../../../../constants/strings";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {storeSigningKeyAction} from "../../../../actions";
import {mnemonicSchema, privateKeySchema} from "./validation";
import {ValidationResult} from "@hapi/joi";
import {Eth2HDWallet} from "../../../../services/wallet";

type IOwnProps = Pick<RouteComponentProps, "history">;

class SigningKeyImport extends Component<IOwnProps & IInjectedProps, {}> {
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

    private handleSubmit= (input: string): void => {
        const signingKey = input.startsWith("0x") ? input : Eth2HDWallet.getKeypair(input).privateKey.toHexString();
        this.props.storeSigningKey(signingKey);

        this.props.history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL));
    };

}

// redux

interface IInjectedProps {
    storeSigningKey: typeof storeSigningKeyAction;
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeSigningKey: storeSigningKeyAction,
        },
        dispatch
    );

export const SigningKeyImportContainer = connect(
    null,
    mapDispatchToProps
)(SigningKeyImport);