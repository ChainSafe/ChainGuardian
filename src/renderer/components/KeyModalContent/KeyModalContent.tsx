import React, {useState, ReactElement, useEffect} from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {Eth2HDWallet} from "../../services/Eth2HDWallet";

interface IKeyModalProps {
    title: string,
    description?: string,
    onSubmit: (input: string) => void
}

export default function KeyModalContent(props: IKeyModalProps): ReactElement {
    const [input, setinput] = useState("");
    const [valid, setvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const input = e.currentTarget.value
        setinput(input);

        // 
        if(input === ""){
            setvalid(false)
            setErrorMessage("")
            return
        }

        const {isValid, message} = Eth2HDWallet.checkValidity(input);
        setvalid(isValid);

        if(!isValid){
            setErrorMessage(message)
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
                    placeholder="Enter your unique mnemonic signing key" />
                <span className="submit-button-container">
                    <ButtonPrimary buttonId="submit" onClick={handleSubmit}>Submit</ButtonPrimary>
                </span>
            </div>
        </>
    );
}
