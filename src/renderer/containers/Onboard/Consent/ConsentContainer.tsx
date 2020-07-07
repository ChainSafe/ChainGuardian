import React, {Component} from "react";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {bindActionCreators, Dispatch} from "redux";
import {saveAccountSettings} from "../../../actions/settings";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {Routes} from "../../../constants/routes";

class Consent extends Component<Pick<RouteComponentProps, "history"> & IInjectedProps> {
    private onYesClick(): void {
        this.onButtonClick(true);
    }

    private onNoClick(): void {
        this.onButtonClick(false);
    }

    private onButtonClick(reporting: boolean): void {
        this.props.saveSettings({
            reporting,
        });
        this.props.history.push(Routes.DASHBOARD_ROUTE);
    }

    public render() {
        return (
            <>
                <h1>Do you want to send your error reports?</h1>
                <p>By sharing ChainGuardian bug reports that might occur we will be able to improve your app experience. Don't worry! We will never be able to access your keys.</p>

                <div className="action-buttons">
                    <ButtonSecondary onClick={this.onNoClick.bind(this)} large>NO</ButtonSecondary>
                    <ButtonPrimary onClick={this.onYesClick.bind(this)} large>YES</ButtonPrimary>
                </div>
            </>
        );
    }
}

interface IInjectedProps {
    saveSettings: typeof saveAccountSettings,
}

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            saveSettings: saveAccountSettings,
        },
        dispatch
    );

export const ConsentContainer = connect(
    null,
    mapDispatchToProps
)(Consent);
