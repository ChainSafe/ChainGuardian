import React, {useState} from "react";
import {isSupportedBeaconChain} from "../../services/eth2/client";
import {defaultNetworkIndex, networks, networksList} from "../../services/eth2/networks";
import {Joi} from "../../services/validation";
import {ButtonPrimary, ButtonSecondary} from "../Button/ButtonStandard";
import {Dropdown} from "../Dropdown/Dropdown";
import {InputForm} from "../Input/InputForm";

interface IInputBeaconNodeProps {
    onGoSubmit: (url: string, network: string) => void;
    onRunNodeSubmit: (network: string) => void;
}

export const InputBeaconNode: React.FunctionComponent<IInputBeaconNodeProps> = (props: IInputBeaconNodeProps) => {
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(defaultNetworkIndex);
    const [errorMessage, setErrorMessage] = useState("");
    const [beaconNodeInput, setBeaconNodeInput] = useState("");

    const onBeaconNodeInput = (e: React.FormEvent<HTMLInputElement>): void => {
        if (errorMessage !== "") {
            setErrorMessage("");
        }

        setBeaconNodeInput(e.currentTarget.value);
    };

    const isValidBeaconNode = async(): Promise<boolean> => {
        const beaconNodeInputSchema = Joi.string().uri();
        const validationResult = beaconNodeInputSchema.validate(beaconNodeInput);
        if (validationResult.error) {
            setErrorMessage("Invalid URL.");
            return false;
        }

        if (!(await isSupportedBeaconChain(beaconNodeInput, getSelectedNetwork()))) {
            setErrorMessage("Unsupported beacon chain or not working");
            return false;
        }

        return true;
    };

    const onGoSubmit = async(): Promise<void> => {
        if (await isValidBeaconNode()) {
            props.onGoSubmit(beaconNodeInput, getSelectedNetwork());
        }
    };

    const onRunNodeSubmit = (): void => {
        props.onRunNodeSubmit(getSelectedNetwork());
    };

    const getSelectedNetwork = (): string => {
        return networks[selectedNetworkIndex].networkName;
    };

    return (
        <>
            <h1>Add your beacon node URL</h1>
            <p>Either add the URL or run a Dockerized beacon node on your device.</p>

            <div className="row align-left">
                <Dropdown
                    label="Network"
                    current={selectedNetworkIndex}
                    onChange={setSelectedNetworkIndex}
                    options={networksList}
                />
            </div>

            <div className="action-buttons">
                <InputForm
                    focused
                    onChange={onBeaconNodeInput}
                    inputValue={beaconNodeInput}
                    placeholder="http://... beacon node URL"
                    inputId="beaconURL"
                    errorMessage={errorMessage}
                    valid={errorMessage !== "" ? false : null}
                    onSubmit={onGoSubmit}
                />

                <ButtonSecondary onClick={onGoSubmit} buttonId="go">GO</ButtonSecondary>
            </div>

            <h5 className="input-or">OR</h5>

            <ButtonPrimary buttonId="run-node" onClick={onRunNodeSubmit}>RUN OWN NODE</ButtonPrimary>

            <div className="skip-notes">
                This requires a Docker installed. We will run a Dockerized beacon node on your device.
            </div>
        </>
    );
};
