import React, {Component} from "react";
import * as Sentry from "@sentry/electron";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {Routes} from "../../../constants/routes";
import {saveAccountSettings} from "../../../ducks/settings/actions";

class Consent extends Component<Pick<RouteComponentProps, "history"> & IInjectedProps> {
    public onYesClick(): void {
        this.onButtonClick(true);
    }

    public onNoClick(): void {
        if (process.env.NODE_ENV === "production") {
            Sentry.getCurrentHub().getClient().getOptions().enabled = false;
        }
        this.onButtonClick(false);
    }

    public onButtonClick(reporting: boolean): void {
        this.props.saveSettings({
            reporting,
        });
        this.props.history.push(Routes.DASHBOARD_ROUTE);
    }

    public render(): React.ReactElement {
        return (
            <>
                <h1>Do you want to send your error reports?</h1>
                <p>By sharing ChainGuardian bug reports that might occur we will be able to improve your app experience.
                    Don&#39;t worry! We will never be able to access your keys.</p>

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

const mapDispatchToProps: IInjectedProps = ({
    saveSettings: saveAccountSettings,
});

export const ConsentContainer = connect(
    null,
    mapDispatchToProps
)(Consent);
