import React, {Component, ReactElement} from "react";
import {RouteComponentProps} from "react-router-dom";
import KeyModalContent from "../../../../components/KeyModalContent/KeyModalContent";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {IMPORT_SIGNING_KEY_PLACEHOLDER, IMPORT_SIGNING_KEY_TITLE} from "../../../../constants/strings";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {mnemonicSchema, privateKeySchema} from "./validation";
import {ValidationResult} from "@hapi/joi";
import {PrivateKey} from "@chainsafe/bls";
import {deriveEth2ValidatorKeys, deriveKeyFromMnemonic} from "@chainsafe/bls-keygen";
import {storeSigningKeyAction, storeValidatorKeysAction} from "../../../../actions";
import {toHexString} from "@chainsafe/ssz";

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
        if(input.startsWith("0x")) {
            try {
                PrivateKey.fromHexString(input);
            } catch (e) {
                //TODO: display error message
                console.error("Invalid private key");
                return;
            }
            this.props.storeSigningKey(input);
            this.props.history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
        } else {
            const validatorIndex = 1;
            const validatorKeys = deriveEth2ValidatorKeys(
                deriveKeyFromMnemonic(input),
                validatorIndex
            );
            this.props.storeValidatorKeys(
                PrivateKey.fromBytes(validatorKeys.signing).toHexString(),
                PrivateKey.fromBytes(validatorKeys.withdrawal).toPublicKey().toHexString(),
                `m/12381/3600/${validatorIndex}/0/0`
            );
            this.props.history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
        }
    };

}

// redux

interface IInjectedProps {
    storeSigningKey: typeof storeSigningKeyAction;
    storeValidatorKeys: typeof storeValidatorKeysAction;
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeSigningKey: storeSigningKeyAction,
            storeValidatorKeys: storeValidatorKeysAction,
        },
        dispatch
    );

export const SigningKeyImportContainer = connect(
    null,
    mapDispatchToProps
)(SigningKeyImport);
