import React from "react";
import ReactTooltip from "react-tooltip";

export interface INodeCardProps {
    title: string;
    value: number | string;
    url: string;
    onClick: () => void;
    isSyncing?: boolean;
}

export const NodeCard: React.FunctionComponent<INodeCardProps> = (
    props: INodeCardProps) => {
    const {onClick, title, value, url, isSyncing} = props;

    return (
        <div onClick={(): void=> onClick()} className="node-card-container">
            <h2>{title}</h2>
            <span className="node-text">{url}</span>
            <div className="row centered">
                <h2>{value}</h2>
                {value ?
                    <>
                        <ReactTooltip />
                        <span
                            className={isSyncing ? "sync-progress-icon" : "success-icon"}
                            data-tip={isSyncing ? "Syncing" : "Synced"}
                        />
                    </>
                    : null}
            </div>
            <span className="node-text time">Slot height</span>
        </div>
    );
};