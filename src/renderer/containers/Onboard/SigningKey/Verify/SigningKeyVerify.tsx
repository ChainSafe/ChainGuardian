import * as React from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {ordinalSuffix} from "../../../../services/mnemonic/utils/ordinalSuffix";
import {IRootState} from "../../../../reducers";
import {storeSigningVerificationStatusAction,storeSigningKeyAction} from "../../../../actions";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";
import {Eth2HDWallet} from "../../../../services/wallet";

type IOwnProps = Pick<RouteComponentProps, "history" | "location">;

const SigningMnemonicQuestion: React.FunctionComponent<
IOwnProps & 
IInjectedProps & 
Pick<IRootState, "register">> = (props) => {

    const mnemonic = props.register.signingMnemonic.split(" ");
    const randArray = getRandomIntArray(12);
    const correctAnswerIndex = randArray[getRandomInt(3)];

    const handleCorrectAnswer = async (): Promise<void> => {
        
        const {register, storeSigningKey, history} = props;

        const signingKey = Eth2HDWallet.getKeypair(register.signingMnemonic).privateKey.toHexString();
        storeSigningKey(signingKey);

        if(props.location.state) {
            history.replace(Routes.CHECK_PASSWORD);
        }
        else {
            history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL));
        }
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
    storeSigningKey: typeof storeSigningKeyAction;
    setVerificationStatus: typeof storeSigningVerificationStatusAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        storeSigningKey: storeSigningKeyAction,
        setVerificationStatus: storeSigningVerificationStatusAction
    }, dispatch);

export const SigningKeyVerifyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SigningMnemonicQuestion);