import React, {useState, ReactElement, useEffect} from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {ValidationResult} from "@hapi/joi";
import {Joi} from "../../services/validation";
import {PrivateKey} from "@chainsafe/bls";
import {deriveEth2ValidatorKeys, deriveKeyFromMnemonic} from "@chainsafe/bls-keygen";

interface IKeyModalProps {
    title: string;
    description?: string;
    onSubmit: (input: string) => void;
    placeholder: string;
    validate?: (input: string) => ValidationResult;
    validatorIndex: string;
}

export default function KeyModalContent(props: IKeyModalProps): ReactElement {
    const [input, setinput] = useState("");
    const [valid, setvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [pubKey, setPubKey] = useState("Waiting for input");

    const formatAndSetPubKey = (key: string): void => {
        const middle = key.length / 2;
        setPubKey(key.replace(key.slice(middle - 25, middle + 24), " . . .   . . . "));
    };

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const input = e.currentTarget.value;
        setinput(input);

        if (input === "") {
            setvalid(false);
            setErrorMessage("");
            setPubKey("Waiting for input");
            return;
        }

        // default fallback validation => hex string
        const validationResult = props.validate ? props.validate(input) : Joi.crypto().hex().validate(input);
        const isValid = !validationResult.error;
        setvalid(isValid);
        if (!isValid) {
            setErrorMessage(validationResult.error.message);
            if (input.startsWith("0x")) {
                setPubKey("Invalid Private Key");
            } else {
                setPubKey("Invalid mnemonic");
            }
        } else {
            if (input.startsWith("0x")) {
                try {
                    formatAndSetPubKey(PrivateKey.fromHexString(input).toPublicKey().toHexString());
                } catch (e) {
                    setPubKey("Invalid Private Key");
                    return;
                }
            } else {
                const validatorKeys = deriveEth2ValidatorKeys(
                    deriveKeyFromMnemonic(input),
                    Number(props.validatorIndex),
                );
                formatAndSetPubKey(PrivateKey.fromBytes(validatorKeys.withdrawal).toPublicKey().toHexString());
            }
        }
    };

    const handleSubmit = (): void => {
        if (valid) {
            props.onSubmit(input);
        }
    };

    useEffect(() => {}, [valid]);

    return (
        <>
            <h1>{props.title}</h1>
            {props.description && <p>{props.description}</p>}
            <div className={`key-input-container ${props.description ? "" : "mt-32"}`}>
                <InputForm
                    inputId='inputKey'
                    focused
                    onChange={handleChange}
                    inputValue={input}
                    valid={errorMessage === "" && valid === false ? undefined : valid}
                    errorMessage={errorMessage}
                    placeholder={props.placeholder}
                    onSubmit={(e): void => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                />
                <div className='info-container'>
                    <div>
                        <h3>Index</h3>
                        <InputForm inputValue={props.validatorIndex} disabled centered />
                    </div>
                    <div>
                        <h3>Public Key</h3>
                        <InputForm inputValue={pubKey} disabled />
                    </div>
                </div>
                <span className='submit-button-container'>
                    <ButtonPrimary buttonId='submit' disabled={!valid} onClick={handleSubmit}>
                        Submit
                    </ButtonPrimary>
                </span>
            </div>
        </>
    );
}
