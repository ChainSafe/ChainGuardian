import * as React from "react";
import {ButtonPrimary, ButtonDestructive} from "../Button/ButtonStandard";
import {AddButton} from "../Button/ButtonAction";
import {ValidatorCard, NodeCard} from "../Cards/Cards";
import {useState} from "react";
import BN from "bn.js";

export interface IValidatorProps {
    name: string,
    stats: {
        roi: number,
        balance: BN,
        uptime: number
    };
    beaconNodes: {
        id: string,
        url: string,
        respTime: number
    }[];
    onBeaconNodeClick: () => void;
    onRemoveClick: () => void;
    onDetailsClick: () => void;
    onAddNodeClick: () => void;
}

export const Validator: React.FunctionComponent<IValidatorProps> = (
    props: IValidatorProps) => {
    const [nodeStatus, setNodeStatus] = useState(false);

    let numOfNodes = 0;
    for (let i = 0; i < props.beaconNodes.length; i++) {
        if (props.beaconNodes[i].id) numOfNodes++;
    }

    const getShowMore = (): void=>{
        !nodeStatus ? setNodeStatus(true) : setNodeStatus(false);
    };

    return(
        <div className="validator-container">
            <div className="validator-stats">
                <h2>{props.name}</h2>
                <div className="validator-stats-container" >
                    <ValidatorCard value={props.stats.roi} textArray={["Return (ETH)","ROI"]} />
                    <ValidatorCard value={props.stats.balance} textArray={["Balance","ETH"]} />
                    <ValidatorCard value={props.stats.uptime} textArray={["Uptime","DAYS"]} />
                </div>
            </div>
            <div className="validator-nodes">
                <div className="node-container">
                    <div className="node-grid-container" >
                        {
                            nodeStatus ?
                                props.beaconNodes.map(node => {
                                    return <NodeCard 
                                        onClick={(): void=>{props.onBeaconNodeClick;}}
                                        key={node.id} 
                                        value={node.respTime} 
                                        textArray={[node.id,node.url]}/>;
                                })
                                :
                                props.beaconNodes.filter((e)=>{
                                    if(props.beaconNodes.indexOf(e)<2){
                                        return e; 
                                    }
                                }).map(node => {
                                    return <NodeCard 
                                        onClick={(): void=>{props.onBeaconNodeClick;}}
                                        key={node.id} 
                                        value={node.respTime} 
                                        textArray={[node.id,node.url]}/>;
                                })
                        }
                    </div>
                    <AddButton onClick={(): void=>{props.onAddNodeClick;}}/>
                    <div 
                        onClick={(): void=>{getShowMore();}} 
                        className={`show 
                            ${numOfNodes>2 ? "":"none"}
                            ${nodeStatus ? "less":"more"}`}>
                        {nodeStatus ? "Show Less":"Show More"}
                    </div>
                </div>
                <div className="validator-buttons">
                    <ButtonDestructive onClick={(): void=>{props.onRemoveClick;}}>REMOVE</ButtonDestructive>
                    <ButtonPrimary onClick={(): void=>{props.onDetailsClick;}}>DETAILS</ButtonPrimary>
                </div>
            </div>
        </div>
    );
};