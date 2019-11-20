import * as React from "react";
import {ButtonPrimary, ButtonDestructive} from "../Button/ButtonStandard";
import {AddButton} from "../Button/ButtonAction";
import {ValidatorCard, NodeCard} from "../Cards/Cards";

export interface IValidatorProps {
    stats?: {
        roi: number,
        balance: number,
        uptime: number
    };
    beaconNodes?: {
        id: string,
        url: string,
        respTime: number
    }[];
    onBeaconNodeClick: () => void;
    onRemoveClick: () => void;
    onDetailsClick: () => void;
}

export const Validator: React.FunctionComponent<IValidatorProps> = (
    props: IValidatorProps) => {

    
    console.log(props.beaconNodes);
    return(
        <div className="validator-container">
            <div className="validator-stats">
                <h2>Validator 001</h2>
                <div className="validator-stats-container" >
                    <ValidatorCard value={10} textArray={["Return (ETH)","ROI"]} />
                    <ValidatorCard value={.1206} textArray={["Balance","ETH"]} />
                    <ValidatorCard value={92.1} textArray={["Uptime","DAYS"]} />
                </div>
            </div>
            <div className="validator-nodes">
                <div className="node-container">
                    <div className="node-grid-container" >
                        <NodeCard value={250} textArray={["Beacon Node","www.beacon.ethereum.org"]} />
                        <NodeCard value={3} textArray={["Beacon Node","Local (127.0.01)"]} />
                    </div>
                    <AddButton/>
                    <div className="show more">Show More</div>
                </div>
                <div className="validator-buttons">
                    <ButtonDestructive>REMOVE</ButtonDestructive>
                    <ButtonPrimary>DETAILS</ButtonPrimary>
                </div>
            </div>
        </div>
    );
};