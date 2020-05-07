import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {networks, networksList} from "../../../services/eth2/networks";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {setNetworkAction} from "../../../actions";
import {saveBeaconNodeAction} from "../../../actions/network";
import {Joi} from "../../../services/validation";

type IOwnProps = Pick<RouteComponentProps, "history">;
interface IInjectedProps {
    setNetwork: typeof setNetworkAction;
    saveBeaconNode: typeof saveBeaconNodeAction;
}

const ConfigureContainerComponent: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [beaconNodeInput, setBeaconNodeInput] = useState("");
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    const onBeaconNodeInput = (e: React.FormEvent<HTMLInputElement>): void => {
        setBeaconNodeInput(e.currentTarget.value);
    };

    const handleSubmit = (): void => {
        props.setNetwork(networks[selectedNetworkIndex].networkName);
    };

    const onRunNodeSubmit = (): void => {
        handleSubmit();
        props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_BEACON_NODE));
    };

    const isValidBeaconNode = (): boolean => {
        const beaconNodeInputSchema = Joi.string().uri();
        const validationResult = beaconNodeInputSchema.validate(beaconNodeInput);
        if (validationResult.error) {
            setErrorMessage("Invalid URL.");
            return false;
        }

        return true;
        // TODO: Validate if real beacon node here
    };

    const onGoSubmit = (): void => {
        if (isValidBeaconNode()) {
            props.saveBeaconNode(beaconNodeInput);
            handleSubmit();
            props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.DEPOSIT_TX));
        }
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
                />

                <ButtonSecondary onClick={onGoSubmit} buttonId="go">GO</ButtonSecondary>
            </div>

            <h5 className="input-or">OR</h5>

            <ButtonPrimary buttonId="run-node" onClick={onRunNodeSubmit}>RUN OWN NODE</ButtonPrimary>

            <div className="skip-notes">
                This requires a docker installed. We will run a dockerized beacon node on your device.
            </div>
        </>
    );
};

const mapDispatchToProps = (dispatch: Dispatch): IInjectedProps =>
    bindActionCreators(
        {
            setNetwork: setNetworkAction,
            saveBeaconNode: saveBeaconNodeAction,
        },
        dispatch
    );

export const ConfigureContainer = connect(
    null,
    mapDispatchToProps
)(ConfigureContainerComponent);
