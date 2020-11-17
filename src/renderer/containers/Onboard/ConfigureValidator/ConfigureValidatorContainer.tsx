import React, {useEffect, useState} from "react";
import {InputForm} from "../../../components/Input/InputForm";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {useHistory} from "react-router-dom";
import {ButtonPrimary} from "../../../components/Button/ButtonStandard";
import {wordlists} from "bip39";
import {randBetween} from "@chainsafe/lodestar-utils";
import {useDispatch} from "react-redux";
import {setName as setNameAction} from "../../../ducks/register/actions";

export const ConfigureValidatorContainer: React.FC = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [defaultName, setDefaultName] = useState("");

    useEffect(() => {
        const capitalize = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);

        const englishWordList = wordlists["english"];
        setDefaultName(
            "Validator " +
                capitalize(englishWordList[randBetween(0, englishWordList.length / 2)]) +
                " " +
                capitalize(englishWordList[randBetween(englishWordList.length / 2, englishWordList.length - 1)]),
        );
    }, []);

    const dispatch = useDispatch();

    const onSubmit = (): void => {
        dispatch(setNameAction(name ? name : defaultName));
        history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
    };

    return (
        <>
            <h1>Configure Validator settings</h1>
            <p>You can skip customizing this data if you want to use the default values.</p>

            <div className='configure-port'>
                <div className='row'>
                    <h3>Validator Name</h3>
                </div>
                <InputForm
                    placeholder={`default: ${defaultName}`}
                    onChange={(e): void => setName(e.currentTarget.value)}
                    inputValue={name}
                />
            </div>

            <span className='submit-button-container'>
                <ButtonPrimary buttonId='submit' onClick={onSubmit}>
                    Next
                </ButtonPrimary>
            </span>
        </>
    );
};
