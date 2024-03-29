import React, {useState} from "react";
import {Joi} from "../../services/validation";
import {ButtonPrimary, ButtonSecondary} from "../Button/ButtonStandard";
import {InputForm} from "../Input/InputForm";
import {CgEth2ApiClient} from "../../services/eth2/client/module";

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
            return await CgEth2ApiClient.getBeaconURLNetworkName(beaconNodeInput);
        } catch (e) {
            setErrorMessage(e.message);
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
