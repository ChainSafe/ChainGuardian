import React, {Component, ReactElement} from "react";
import {VerifyMnemonic} from "../../../../components/VerifyMnemonic/VerifyMnemonic";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {RouteComponentProps} from "react-router";
import {getRandomInt, getRandomIntArray} from "../../../../services/mnemonic/utils/random";
import {ordinalSuffix} from "../../../../services/mnemonic/utils/ordinalSuffix";
import {IRootState} from "../../../../reducers";
import {storeWithdrawalVerificationStatusAction} from "../../../../actions";
import {Routes, OnBoardingRoutes} from "../../../../constants/routes";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {

}
interface IInjectedProps {
    setVerificationStatus: typeof storeWithdrawalVerificationStatusAction;
}

class WithdrawalMnemonicQuestion extends Component<IOwnProps & IInjectedProps &  Pick<IRootState, "register">, {}> {
    public render(): ReactElement {
        const mnemonic = this.props.register.withdrawalMnemonic.split(" ");
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

    private handleInvalidAnswer = (): void => {
        this.props.setVerificationStatus(true);
        this.props.history.goBack();
    };
    
    private handleCorrectAnswer= (): void => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
    };
}

const mapStateToProps = (state: IRootState): Pick<IRootState, "register"> => ({
    register: state.register
});
const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            setVerificationStatus: storeWithdrawalVerificationStatusAction,
        },
        dispatch
    );

export const WithdrawalKeyVerifyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WithdrawalMnemonicQuestion);