import * as React from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {ordinalSuffix} from "../../../../services/mnemonic/utils/ordinalSuffix";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {deriveEth2ValidatorKeys, deriveKeyFromMnemonic} from "@chainsafe/bls-keygen";
import {toHexString} from "@chainsafe/ssz";
import {PrivateKey} from "@chainsafe/bls";
import {IRootState} from "../../../../ducks/reducers";
import {storeValidatorKeys, storeSigningVerificationStatus} from "../../../../ducks/register/actions";

type IOwnProps = Pick<RouteComponentProps, "history">;

const SigningMnemonicQuestion: React.FunctionComponent<
IOwnProps &
IInjectedProps &
Pick<IRootState, "register">> = (props) => {

    const mnemonic = props.register.signingMnemonic.split(" ");
    const randArray = getRandomIntArray(12);
    const correctAnswerIndex = randArray[getRandomInt(3)];

    const handleCorrectAnswer = async (): Promise<void> => {
        props.setVerificationStatus(false);

        const {register, storeValidatorKeys, history} = props;
        const validatorIndex = 1;
        const validatorKeys = deriveEth2ValidatorKeys(
            deriveKeyFromMnemonic(register.signingMnemonic),
            validatorIndex
        );
        storeValidatorKeys(
            toHexString(validatorKeys.signing),
            PrivateKey.fromBytes(validatorKeys.withdrawal).toPublicKey().toHexString(),
            `m/12381/3600/${validatorIndex}/0/0`);

        history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
    };

    const handleInvalidAnswer = (): void => {
        props.setVerificationStatus(true);
        props.history.goBack();
    };

    return (
        <VerifyMnemonic
            question={`What’s the ${ordinalSuffix(correctAnswerIndex+1)} word in the mnemonic?`}
            answers={[mnemonic[randArray[0]], mnemonic[randArray[1]], mnemonic[randArray[2]]]}
            correctAnswer={mnemonic[correctAnswerIndex]}
            onCorrectAnswer={(): void => {setTimeout(handleCorrectAnswer, 500);}}
            onInvalidAnswer={(): void => {setTimeout(handleInvalidAnswer, 500);}}
        />
    );
};

// redux

interface IInjectedProps {
    storeValidatorKeys: typeof storeValidatorKeys;
    setVerificationStatus: typeof storeSigningVerificationStatus;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    // TODO: use selector
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        storeValidatorKeys: storeValidatorKeys,
        setVerificationStatus: storeSigningVerificationStatus
    }, dispatch);

export const SigningKeyVerifyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SigningMnemonicQuestion);
