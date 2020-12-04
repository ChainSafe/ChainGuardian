import React from "react";
import {RouteComponentProps} from "react-router-dom";
import KeyModalContent from "../../../../components/KeyModalContent/KeyModalContent";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {IMPORT_SIGNING_KEY_PLACEHOLDER, IMPORT_SIGNING_KEY_TITLE} from "../../../../constants/strings";
import {useDispatch} from "react-redux";
import {mnemonicSchema, privateKeySchema} from "./validation";
import {ValidationResult} from "joi";
import {SecretKey} from "@chainsafe/bls";
import {deriveEth2ValidatorKeys, deriveKeyFromMnemonic} from "@chainsafe/bls-keygen";
import {storeSigningKey, storeValidatorKeys} from "../../../../ducks/register/actions";

type IOwnProps = Pick<RouteComponentProps, "history">;

export const SigningKeyImportContainer: React.FC<IOwnProps> = ({history}) => {
    const validatorIndex = "1";

    const dispatch = useDispatch();

    const handleSubmit = (input: string): void => {
        if (input.startsWith("0x")) {
            try {
                SecretKey.fromHex(input);
            } catch (e) {
                //TODO: display error message
                console.error("Invalid private key");
                return;
            }
            dispatch(storeSigningKey(input));
            history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
        } else {
            const validatorKeys = deriveEth2ValidatorKeys(deriveKeyFromMnemonic(input), Number(validatorIndex));
            dispatch(
                storeValidatorKeys(
                    SecretKey.fromBytes(validatorKeys.signing).toHex(),
                    `m/12381/3600/${validatorIndex}/0/0`,
                ),
            );
            history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
        }
    };

    return (
        <KeyModalContent
            title={IMPORT_SIGNING_KEY_TITLE}
            onSubmit={handleSubmit}
            placeholder={IMPORT_SIGNING_KEY_PLACEHOLDER}
            validate={(input: string): ValidationResult => {
                const schema = input.startsWith("0x") ? privateKeySchema : mnemonicSchema;
                return schema.validate(input);
            }}
            validatorIndex={validatorIndex}
        />
    );
};
