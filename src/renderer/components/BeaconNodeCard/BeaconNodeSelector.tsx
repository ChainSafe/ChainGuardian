import React from "react";
import {BeaconNodeCard} from "./BeaconNodeCard";
import lighthouseLogo from "../../assets/img/beacon/lighthouse.png";
import tekuLogo from "../../assets/img/beacon/teku.png";
import nimbusLogo from "../../assets/img/beacon/nimbus.png";
import prysmLogo from "../../assets/img/beacon/prysm.png";
import {ButtonPrimary} from "../Button/ButtonStandard";

interface IBeaconNodeSelector {
    selected: string;
    onChane: (name: string) => void;
    onSubmit: () => void;
}

export const BeaconNodeSelector: React.FC<IBeaconNodeSelector> = ({selected, onChane, onSubmit}) => {
    const handleChange = (name: string) => (): void => {
        onChane(name);
    };

    return (
        <>
            <h1>Select provider</h1>
            <p>Select provider for local Dockerized beacon node.</p>

            <div className='beacon-node-selector'>
                <div
                    onClick={handleChange("lighthouse")}
                    className={"card-container" + (selected === "lighthouse" ? " " + "selected-card" : "")}>
                    <BeaconNodeCard name='Lighthouse' logo={lighthouseLogo} />
                </div>
                <div
                    onClick={handleChange("teku")}
                    className={"card-container" + (selected === "teku" ? " " + "selected-card" : "")}>
                    <BeaconNodeCard name='Teku' logo={tekuLogo} />
                </div>
                <div
                    onClick={handleChange("nimbus")}
                    className={"card-container beta-node" + (selected === "nimbus" ? " " + "selected-card" : "")}>
                    <BeaconNodeCard name='Nimbus' logo={nimbusLogo} ribbon='BETA' />
                </div>
                <div
                    onClick={handleChange("prysm")}
                    className={"card-container beta-node" + (selected === "prysm" ? " " + "selected-card" : "")}>
                    <BeaconNodeCard name='Prysm' logo={prysmLogo} ribbon='BETA' />
                </div>
            </div>

            <ButtonPrimary onClick={onSubmit} buttonId='next' disabled={!selected}>
                CHOOSE
            </ButtonPrimary>
        </>
    );
};
