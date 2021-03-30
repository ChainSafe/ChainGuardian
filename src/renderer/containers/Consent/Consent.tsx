import React, {useState} from "react";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {Background} from "../../components/Background/Background";
import {Modal} from "../../components/Modal/Modal";
import {CheckBox} from "../../components/CheckBox/CheckBox";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {saveAccountSettings} from "../../ducks/settings/actions";
import {Routes} from "../../constants/routes";

export const Consent: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [isTracking, setIsTracking] = useState(true);
    const [isReporting, setIsReporting] = useState(true);

    const onContinueClick = (): void => {
        dispatch(saveAccountSettings({reporting: isReporting}));
        history.push(Routes.DASHBOARD_ROUTE);
    };

    return (
        <Background>
            <Modal>
                <h1>Collecting data Consent?</h1>
                <p>
                    By sharing ChainGuardian bug reports and analytics data we will be able to improve your app
                    experience. Don&#39;t worry! We will never be able to access your keys or share to 3th party.
                </p>

                <div className='consent-options-container'>
                    <CheckBox
                        checked={isTracking}
                        id='tracking'
                        label='Send your analytics data.'
                        onClick={(): void => {
                            setIsTracking(!isTracking);
                        }}
                    />
                    <CheckBox
                        checked={isReporting}
                        id='reporting'
                        label='Send your error reports.'
                        onClick={(): void => {
                            setIsReporting(!isReporting);
                        }}
                    />
                </div>

                <ButtonPrimary onClick={onContinueClick} large>
                    Continue
                </ButtonPrimary>
            </Modal>
        </Background>
    );
};
