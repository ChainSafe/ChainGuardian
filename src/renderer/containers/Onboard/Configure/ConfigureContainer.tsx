import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import {ButtonPrimary, ButtonSecondary} from "../../../components/Button/ButtonStandard";
import {InputForm} from "../../../components/Input/InputForm";
import {OnBoardingRoutes, Routes} from "../../../constants/routes";
import {Dropdown} from "../../../components/Dropdown/Dropdown";
import {networks} from "../../../services/deposit/networks";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {setNetworkAction} from "../../../actions";

type IOwnProps = Pick<RouteComponentProps, "history">;
interface IInjectedProps {
    setNetwork: typeof setNetworkAction;
}

const ConfigureContainerComponent: React.FunctionComponent<IOwnProps & IInjectedProps> = (props) => {
    const [beaconNodeInput, setBeaconNodeInput] = useState("");
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);

    const onBeaconNodeInput = (e: React.FormEvent<HTMLInputElement>): void => {
        setBeaconNodeInput(e.currentTarget.value);
        // TODO: Validate beacon node here
    };
    const networkOptions = networks.map((contract) => contract.networkName);

    const onSubmit = (): void => {
        props.setNetwork(networks[selectedNetworkIndex].networkName);
        props.history.push(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_BEACON_NODE));
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
                    options={networkOptions}
                />
            </div>

            <div className="action-buttons">
                <InputForm
                    focused
                    onChange={onBeaconNodeInput}
                    inputValue={beaconNodeInput}
                    placeholder="Enter beacon node URL"
                    inputId="beaconURL"
                />

                <ButtonSecondary buttonId="go">GO</ButtonSecondary>
            </div>

            <h5 className="input-or">OR</h5>

            <ButtonPrimary buttonId="run-node" onClick={onSubmit}>RUN OWN NODE</ButtonPrimary>

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
        },
        dispatch
    );

export const ConfigureContainer = connect(
    null,
    mapDispatchToProps
)(ConfigureContainerComponent);