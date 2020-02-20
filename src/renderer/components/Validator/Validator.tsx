import * as React from "react";
import {ButtonPrimary, ButtonDestructive} from "../Button/ButtonStandard";
import {AddButton} from "../Button/ButtonAction";
import {ValidatorStat} from "../Cards/ValidatorStat";
import {NodeCard} from "../Cards/NodeCard";
import {useState} from "react";

export interface IStatsType{
    roi: number;
    balance: bigint | number;
    uptime: number;
}
export interface IBeaconNode{
    id: string;
    url: string;
    respTime: number;
}
export interface IValidatorProps {
    name: string;
    stats: IStatsType;
    beaconNodes: IBeaconNode[];
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

    const getShowMore = (): void => {
        !nodeStatus ? setNodeStatus(true) : setNodeStatus(false);
    };

    const renderBeaconNodeCard = (x: IBeaconNode): React.ReactElement => {
        return(
            <NodeCard 
                onClick={(): void=>{props.onBeaconNodeClick;}}
                key={x.id} 
                value={x.respTime} 
                title={x.id}
                url={x.url}/>
        );
    };

    return(
        <div className="validator-container">
            <div className="validator-stats">
                <h2>Validator {props.name}</h2>
                <div className="validator-stats-container" >
                    <ValidatorStat value={props.stats.roi} title="Return (ETH)" type="ROI"/>
                    <ValidatorStat value={props.stats.balance} title="Balance" type="ETH"/>
                    <ValidatorStat value={props.stats.uptime} title="Uptime" type="Uptime"/>
                </div>
            </div>
            <div className="validator-nodes">
                <div className="node-container">
                    <div className="node-grid-container" >
                        {
                            nodeStatus ?
                                props.beaconNodes.map(node => {
                                    return renderBeaconNodeCard(node);
                                })
                                :
                                props.beaconNodes.filter((e)=>{
                                    if(props.beaconNodes.indexOf(e)<2){
                                        return e; 
                                    }
                                }).map(node => {
                                    return renderBeaconNodeCard(node);
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