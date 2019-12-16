import React, {Component, ReactElement} from "react";
import KeyModalContent from "../../../components/KeyModalContent/KeyModalContent";
import {
    IMPORT_WITHDRAWAL_KEY_TITLE, 
    IMPORT_WITHDRAWAL_KEY_DESCRIPTION,
    IMPORT_WITHDRAWAL_KEY_PLACEHOLDER
} from "../../../constants/strings";
import {RouteComponentProps} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {storeWithdrawalKeyAction} from "../../../actions";
import {publicKeySchema} from "./validation";
import {ValidationResult} from "@hapi/joi";
import {Routes, OnBoardingRoutes} from "../../../constants/routes";


/**
 * required own props
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps extends Pick<RouteComponentProps, "history"> {
}

/**
 * injected by redux
 */
interface IInjectedProps {
    storeWithdrawalKey: typeof storeWithdrawalKeyAction;
}

class WithdrawalKeyImport extends Component<IOwnProps & IInjectedProps, {}> {
    public render(): ReactElement {
        return (
            <KeyModalContent
                title={IMPORT_WITHDRAWAL_KEY_TITLE}
                description={IMPORT_WITHDRAWAL_KEY_DESCRIPTION}
                placeholder={IMPORT_WITHDRAWAL_KEY_PLACEHOLDER}
                onSubmit={this.handleSubmit}
                validate={(input: string): ValidationResult => {
                    return publicKeySchema.validate(input);
                }}
            />
        );
    }

    private handleSubmit= (input: string): void => {
        this.props.storeWithdrawalKey(input);
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
    };
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            storeWithdrawalKey: storeWithdrawalKeyAction,
        },
        dispatch
    );

export const WithdrawalKeyImportContainer = connect(
    null,
    mapDispatchToProps
)(WithdrawalKeyImport);
