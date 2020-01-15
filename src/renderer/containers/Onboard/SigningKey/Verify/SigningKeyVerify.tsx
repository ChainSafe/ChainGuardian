import React, {Component, ReactElement} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {ordinalSuffix} from "../../../../services/mnemonic/utils/ordinalSuffix";
import {IRootState} from "../../../../reducers";
import {storeSigningVerificationStatusAction,storeSigningKeyAction, storeAddValidatorAction} from "../../../../actions";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";
import {Eth2HDWallet} from "../../../../services/wallet";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {DEFAULT_ACCOUNT} from "../../../../constants/account";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import database from "../../../../services/db/api/database";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {

}

class SigningMnemonicQuestion extends Component<IOwnProps &  Pick<IRootState, "register" | "addValidator" | "auth"> & IInjectedProps, {}> {
    public render(): ReactElement {
        const mnemonic = this.props.register.signingMnemonic.split(" ");
        const randArray = getRandomIntArray(12);
        const correctAnswerIndex = randArray[getRandomInt(3)];
        return (
            <VerifyMnemonic
                question={`What’s the ${ordinalSuffix(correctAnswerIndex+1)} word in the mnemonic?`}
                answers={[mnemonic[randArray[0]], mnemonic[randArray[1]], mnemonic[randArray[2]]]}
                correctAnswer={mnemonic[correctAnswerIndex]}
                onCorrectAnswer={(): void => {setTimeout(this.handleCorrectAnswer, 1000);}}
                onInvalidAnswer={(): void => {setTimeout(this.handleInvalidAnswer, 1000);}}
            />
        );
    }

    private handleCorrectAnswer = async (): Promise<void> => {

        if(this.props.addValidator.addValidator){
            
            const signingKeyString = Eth2HDWallet.getKeypair(this.props.register.signingMnemonic).privateKey.toHexString();
            const signingKey = PrivateKey.fromBytes(
                Buffer.from(signingKeyString.slice(2), "hex")
            );
            
            if(this.props.auth.auth !== null) {
                this.props.auth.auth.addValidator(new Keypair(signingKey));
                const y = await database.account.get(DEFAULT_ACCOUNT);

                await database.account.set(
                    DEFAULT_ACCOUNT, 
                    this.props.auth.auth
                );

            }
            this.props.storeAddValidator(false);
            this.props.history.replace(Routes.DASHBOARD_ROUTE);

        } else {
            const {register, storeSigningKey, history} = this.props;

            const signingKey = Eth2HDWallet.getKeypair(register.signingMnemonic).privateKey.toHexString();
            storeSigningKey(signingKey);
    
            history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.WITHDRAWAL));
        }
    };

    private handleInvalidAnswer = (): void => {
        this.props.setVerificationStatus(true);
        this.props.history.goBack();
    };
}

// redux

interface IInjectedProps {
    storeSigningKey: typeof storeSigningKeyAction;
    setVerificationStatus: typeof storeSigningVerificationStatusAction;
    storeAddValidator: typeof storeAddValidatorAction;
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register" | "addValidator" | "auth"> => ({
    addValidator: state.addValidator,
    auth: state.auth,
    register: state.register
});

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators({
        storeSigningKey: storeSigningKeyAction,
        setVerificationStatus: storeSigningVerificationStatusAction,
        storeAddValidator: storeAddValidatorAction
    }, dispatch);

export const SigningKeyVerifyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SigningMnemonicQuestion);
