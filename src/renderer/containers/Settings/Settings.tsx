import React, {useEffect, useState} from "react";
import OnBoardModal from "../Onboard/OnBoardModal";
import {Background} from "../../components/Background/Background";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {getReporting} from "../../ducks/settings/selectors";
import {CheckBox} from "../../components/CheckBox/CheckBox";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {saveAccountSettings} from "../../ducks/settings/actions";

export const Settings: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const reporting = useSelector(getReporting);
    const [isReporting, setIsReporting] = useState(reporting);
    useEffect(() => {
        setIsReporting(reporting);
    }, [reporting]);

    const onSubmit = (): void => {
        dispatch(saveAccountSettings({reporting: isReporting}));
    };

    const isSame = isReporting === reporting;
    return (
        <Background>
            <OnBoardModal history={history} currentStep={0}>
                <h1>Application Settings</h1>
                <p>Change current application settings.</p>
                <div className='settings-options-container'>
                    <CheckBox
                        checked={isReporting}
                        id='reporting'
                        label='Send your reports.'
                        onClick={(): void => {
                            setIsReporting(!isReporting);
                        }}
                    />
                </div>
                <ButtonPrimary buttonId='save' onClick={onSubmit} disabled={isSame}>
                    SAVE
                </ButtonPrimary>
            </OnBoardModal>
        </Background>
    );
};
