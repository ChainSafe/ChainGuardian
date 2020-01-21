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
import {getConfig} from "../../../../../config/config";
import * as path from "path";
import {remote} from "electron";
import {V4Keystore} from "../../../../services/keystore";
import {CheckPassword} from "../../../../components/CheckPassword/CheckPassword";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {

}

export interface IState {
    showPrompt: boolean
} 

class SigningMnemonicQuestion extends Component<IOwnProps &  Pick<IRootState, "register" | "addValidator" | "auth"> & IInjectedProps, {}> {

    public state: IState = {
        showPrompt: false
    }

    public render(): ReactElement {
        const mnemonic = this.props.register.signingMnemonic.split(" ");
        const randArray = getRandomIntArray(12);
        const correctAnswerIndex = randArray[getRandomInt(3)];
        return (
            <>
                <CheckPassword
                    showPrompt={this.state.showPrompt}
                    onCorrectPassword={this.handleCorrectAnswer}
                />
                <VerifyMnemonic
                    question={`What’s the ${ordinalSuffix(correctAnswerIndex+1)} word in the mnemonic?`}
                    answers={[mnemonic[randArray[0]], mnemonic[randArray[1]], mnemonic[randArray[2]]]}
                    correctAnswer={mnemonic[correctAnswerIndex]}
                    onCorrectAnswer={(): void => {setTimeout(this.handleCorrectAnswer, 1000);}}
                    onInvalidAnswer={(): void => {setTimeout(this.handleInvalidAnswer, 1000);}}
                />
            </>
        );
    }

    private handleCorrectAnswer = async (): Promise<void> => {

        /**
         * In case Add Validator button was pressed on Dashboard
         */
        if(this.props.addValidator.addValidator){
            
            const signingKeyString = Eth2HDWallet.getKeypair(this.props.register.signingMnemonic).privateKey.toHexString();
            const signingKey = PrivateKey.fromBytes(
                Buffer.from(signingKeyString.slice(2), "hex")
            );
            
            if(this.props.auth.auth !== null) {
                this.props.auth.auth.addValidator(new Keypair(signingKey));
                
                const accountDirectory = path.join(getConfig(remote.app).storage.accountsDir, DEFAULT_ACCOUNT);

                // await V4Keystore.create(
                //     path.join(accountDirectory, signingKeyString + ".json"),
                //     password, new Keypair(signingKey)
                // );
                
                // await database.account.set(
                //     DEFAULT_ACCOUNT, 
                //     this.props.auth.auth
                // );

            }
            this.props.storeAddValidator(false);
            this.props.history.replace(Routes.DASHBOARD_ROUTE);
        } 
        /**
         * In case of registration
         */
        else {
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
