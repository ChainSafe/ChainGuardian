import React, {useState, ReactElement, useEffect} from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {publicKeySchema} from "../../services/validation/schemas/PublicKeySchema";
import {getPrivateKeyOrMnemonicSchema} from "../../services/validation/util";


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

        const validator = props.signing ? getPrivateKeyOrMnemonicSchema(input) : publicKeySchema;
        const validation = validator.validate(input);
        const isValid = validation.error === undefined;
        if (!isValid) { setErrorMessage(validation.error.message); }
        setvalid(isValid);
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
