import React from "react";
import {ButtonSecondary} from "./components/Button/ButtonStandard";
import {useDispatch, useSelector} from "react-redux";
import {isDockerDemonIsOffline} from "./ducks/network/selectors";
import {checkDockerDemonIsOnline} from "./ducks/network/actions";

export const DockerDemonNotificator: React.FC = () => {
    const dispatch = useDispatch();
    const isOffline = useSelector(isDockerDemonIsOffline);

    const onOKClick = (): void => {
        dispatch(checkDockerDemonIsOnline());
    };

    return (
        <div className={`confirmModalContainer ${isOffline ? "" : "none"}`}>
            <div className='confirmModal'>
                <h1>Warning</h1>
                <p className='dn_content'>
                    Seems Docker is offline,
                    <br />
                    please start Docker to continue
                </p>
                <ButtonSecondary onClick={onOKClick} large>
                    Retry
                </ButtonSecondary>
            </div>
        </div>
    );
};
