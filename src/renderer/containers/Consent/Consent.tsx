import React from "react";
import {ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {saveAccountSettings} from "../../ducks/settings/actions";
import {Routes} from "../../constants/routes";

export const Consent: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onButtonClick = (reporting: boolean) => (): void => {
        dispatch(saveAccountSettings({reporting}));
        history.push(Routes.DASHBOARD_ROUTE);
    };

    return (
        <Background>
            <Modal>
                <h1>Help us to improve ChainGuardian</h1>
                <p>
                    <br />
                    By sharing bug reports and analytics data we will be able to improve your app experience. An open
                    source data analytics platform Matamo and bug reporting platform Sentry is used.
                    <br />
                    <br />
                    We understand that your privacy must be protected so we don&apos;t store any personally identifiable
                    information or your keys and no data is given to third parties.
                </p>

                <div className='action-buttons'>
                    <ButtonPrimary onClick={onButtonClick(true)} large>
                        Sure
                    </ButtonPrimary>
                    <ButtonSecondary onClick={onButtonClick(false)} large>
                        Decline
                    </ButtonSecondary>
                </div>
            </Modal>
        </Background>
    );
};
