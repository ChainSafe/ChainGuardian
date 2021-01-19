import React, {useState} from "react";
import OnBoardModal from "../Onboard/OnBoardModal";
import {Background} from "../../components/Background/Background";
import {useHistory} from "react-router-dom";
import {ButtonPrimary} from "../../components/Button/ButtonStandard";
import {useDispatch, useSelector} from "react-redux";
import {getBeaconDictionary, getBeaconKeys} from "../../ducks/beacon/selectors";
import {setValidatorBeaconNode} from "../../ducks/validator/actions";
import {useParams} from "react-router";
import {Routes} from "../../constants/routes";
import {CheckBox} from "../../components/CheckBox/CheckBox";
import {getValidator} from "../../ducks/validator/selectors";
import {IRootState} from "../../ducks/reducers";

export const AssignBeaconNode: React.FC = () => {
    const {validatorKey} = useParams();
    const history = useHistory();

    const beaconKeys = useSelector(getBeaconKeys);
    const beaconDictionary = useSelector(getBeaconDictionary);
    const validator = useSelector((state: IRootState) => getValidator(state, {publicKey: validatorKey}));
    const dispatch = useDispatch();

    const [selected, setSelected] = useState<string | undefined>(validator.beaconNodes[0]);

    const onSubmit = (): void => {
        dispatch(setValidatorBeaconNode(validatorKey, [selected]));
        history.push(Routes.DASHBOARD_ROUTE);
    };

    const onClick = (beacon: string) => (): void => {
        setSelected(beacon);
    };

    return (
        <Background>
            <OnBoardModal history={history} currentStep={0}>
                <h1>Validator Beacon Node</h1>
                <p>Assigns Beacon Node to Validator.</p>
                <br />

                <table className='beacon-table'>
                    <thead>
                        <tr>
                            <th />
                            <th>url</th>
                            <th>network</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beaconKeys.map((key) => (
                            <tr key={key} onClick={onClick(key)}>
                                <td>
                                    <CheckBox checked={key === selected} id={key} />
                                </td>
                                <td>{beaconDictionary[key].url}</td>
                                <td>{beaconDictionary[key].network}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <span className='submit-button-container'>
                    <ButtonPrimary buttonId='save' onClick={onSubmit} disabled={!selected}>
                        SAVE
                    </ButtonPrimary>
                </span>
            </OnBoardModal>
        </Background>
    );
};
