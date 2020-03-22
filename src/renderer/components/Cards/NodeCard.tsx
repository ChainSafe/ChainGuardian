import * as React from "react";

export interface INodeCardProps {
    title: string;
    value: number | string;
    url: string;
    onClick: () => void;
    isSyncing?: boolean;
}

export const NodeCard: React.FunctionComponent<INodeCardProps> = (
    props: INodeCardProps) => {
    return(
        <div onClick={(): void=>{props.onClick();}} className="node-card-container">
            <h2>{props.title}</h2>
            <span className="node-text">{props.url}</span>
            <h2>{props.value}</h2>
            <span className="node-text time">Slot height</span>
        </div>
    );
};