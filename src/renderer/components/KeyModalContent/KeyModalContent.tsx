import React, {useState, ReactElement, useEffect} from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonPrimary} from "../Button/ButtonStandard";
import * as Joi from "@hapi/joi";
import {mnemonicSchema} from "../../services/validation/schemas/MnemonicSchema";
import {privateKeySchema} from "../../services/validation/schemas/PrivateKeySchema";
import {publicKeySchema} from "../../services/validation/schemas/PublicKeySchema";


interface IKeyModalProps {
    title: string,
    description?: string,
    onSubmit: (input: string) => void,
    placeholder: string,
    signing: boolean
}

export default function KeyModalContent(props: IKeyModalProps): ReactElement {
    const [input, setinput] = useState("");
    const [valid, setvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const input = e.currentTarget.value;
        setinput(input);

        if(input === ""){
            setvalid(false);
            setErrorMessage("");
            return;
        }

        const validator = props.signing ? Joi.alternatives(mnemonicSchema, privateKeySchema) : publicKeySchema;
        const isValid = !("error" in validator.validate(input));
        setvalid(isValid);

        // console.log(message);

        if(!isValid){
            setErrorMessage("");
        }
    };

    const handleSubmit = (): void => {
        if(valid){
            props.onSubmit(input);
        }
    };

    useEffect(() => {}, [valid]);

    return (
        <>
            <h1>{props.title}</h1>
            {props.description &&
                <p>
                    {props.description}
                </p>
            }
            <div className={`key-input-container ${props.description ? "" : "mt-32"}`}>
                <InputForm
                    inputId="inputKey"
                    focused
                    onChange={handleChange}
                    inputValue={input}
                    valid={errorMessage === "" && valid === false ? undefined : valid}
                    errorMessage={errorMessage}
                    placeholder={props.placeholder} />
                <span className="submit-button-container">
                    <ButtonPrimary buttonId="submit" disabled={!valid} onClick={handleSubmit}>Submit</ButtonPrimary>
                </span>
            </div>
        </>
    );
}
