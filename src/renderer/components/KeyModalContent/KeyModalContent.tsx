import React, {useState, ReactElement} from "react";
import {InputForm} from "../Input/InputForm";
import {ButtonPrimary} from "../Button/ButtonStandard";

interface IKeyModalProps {
    title: string,
    description?: string,
    onSubmit: () => void
}

export default function KeyModalContent(props: IKeyModalProps): ReactElement {
    const [input, setinput] = useState("");

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        setinput(e.currentTarget.value);
    };

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
                    placeholder="Enter your unique mnemonic signing key" />
                <span className="submit-button-container">
                    <ButtonPrimary buttonId="submit" onClick={props.onSubmit}>Submit</ButtonPrimary>
                </span>
            </div>
        </>
    );
}
