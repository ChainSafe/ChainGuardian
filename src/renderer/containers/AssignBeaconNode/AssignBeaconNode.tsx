import React, {useState} from "react";
import OnBoardModal from "../Onboard/OnBoardModal";
import {Background} from "../../components/Background/Background";
import {useHistory} from "react-router-dom";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {Dropdown} from "../../components/Dropdown/Dropdown";
import {useDispatch, useSelector} from "react-redux";
import {getBeaconKeys} from "../../ducks/beacon/selectors";
import {setValidatorBeaconNode} from "../../ducks/validator/actions";
import {useParams} from "react-router";
import {Routes} from "../../constants/routes";

export const AssignBeaconNode: React.FC = () => {
    const {validatorKey} = useParams();
    const history = useHistory();

    const [beaconIndex, setBeaconIndex] = useState<number>(0);
    const beaconNodes = useSelector(getBeaconKeys);
    const dispatch = useDispatch();

    const onChange = (selected: number): void => {
        setBeaconIndex(selected);
    };

    const onSubmit = (): void => {
        dispatch(setValidatorBeaconNode(validatorKey, beaconNodes[beaconIndex]));
        history.push(Routes.DASHBOARD_ROUTE);
    };

    return (
        <Background>
            <OnBoardModal history={history} currentStep={0}>
                <h1>Validator Beacon Node</h1>
                <p>Assigns Beacon Node to Validator.</p>
                <br />

                <div className='dropdown-input-container'>
                    <Dropdown options={beaconNodes} current={beaconIndex} onChange={onChange} />
                </div>

                <span className='submit-button-container'>
                    <ButtonPrimary buttonId='assign' onClick={onSubmit}>
                        ASSIGN
                    </ButtonPrimary>
                </span>
            </OnBoardModal>
        </Background>
    );
};
