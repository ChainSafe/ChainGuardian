import React, {useState} from "react";
import {readBeaconChainNetwork} from "../../services/eth2/client";
import {Joi} from "../../services/validation";
import {ButtonPrimary, ButtonSecondary} from "../Button/ButtonStandard";
import {InputForm} from "../Input/InputForm";

interface IInputBeaconNodeProps {
    onGoSubmit: (url: string, network: string) => void;
    onRunNodeSubmit: () => void;
    displayNetwork?: boolean;
}

export const InputBeaconNode: React.FunctionComponent<IInputBeaconNodeProps> = (props: IInputBeaconNodeProps) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [beaconNodeInput, setBeaconNodeInput] = useState("");

    const onBeaconNodeInput = (e: React.FormEvent<HTMLInputElement>): void => {
        if (errorMessage !== "") {
            setErrorMessage("");
        }

        setBeaconNodeInput(e.currentTarget.value);
    };

    const isValidBeaconNode = async (): Promise<false | string> => {
        const beaconNodeInputSchema = Joi.string().uri();
        const validationResult = beaconNodeInputSchema.validate(beaconNodeInput);
        if (validationResult.error) {
            setErrorMessage("Invalid URL.");
            return false;
        }

        try {
            const network = await readBeaconChainNetwork(beaconNodeInput);
            if (!network) {
                setErrorMessage("Beacon chain network not supported");
                return false;
            }
            return network.networkName;
        } catch (e) {
            setErrorMessage("Beacon chain not found");
            return false;
        }
    };

    const onGoSubmit = async (): Promise<void> => {
        const network = await isValidBeaconNode();
        if (network) {
            props.onGoSubmit(beaconNodeInput, network);
        }
    };

    const onRunNodeSubmit = (): void => {
        props.onRunNodeSubmit();
    };

    return (
        <>
            <h1>Add your beacon node URL</h1>
            <p>Either add the URL or run a Dockerized beacon node on your device.</p>

            <div className='action-buttons'>
                <InputForm
                    focused
                    onChange={onBeaconNodeInput}
                    inputValue={beaconNodeInput}
                    placeholder='http://... beacon node URL'
                    inputId='beaconURL'
                    errorMessage={errorMessage}
                    valid={errorMessage !== "" ? false : null}
                    onSubmit={onGoSubmit}
                />

                <ButtonSecondary onClick={onGoSubmit} buttonId='go'>
                    GO
                </ButtonSecondary>
            </div>

            <h5 className='input-or'>OR</h5>

            <ButtonPrimary buttonId='run-node' onClick={onRunNodeSubmit}>
                RUN OWN NODE
            </ButtonPrimary>

            <div className='skip-notes'>
                This requires a Docker installed. We will run a Dockerized beacon node on your device.
            </div>
        </>
    );
};

InputBeaconNode.defaultProps = {
    displayNetwork: true,
};
