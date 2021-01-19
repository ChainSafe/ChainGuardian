import React from "react";
import ReactTooltip from "react-tooltip";
import {capitalize} from "../../services/utils/formatting";

export interface INodeCardProps {
    title: string;
    value: number | string;
    network?: string;
    url: string;
    onClick: () => void;
    isSyncing?: boolean;
}

export const NodeCard: React.FunctionComponent<INodeCardProps> = ({onClick, title, value, url, network, isSyncing}) => (
    <div onClick={(): void => onClick()} className='node-card-container'>
        <h2>{title}</h2>
        {network && <h3>{capitalize(network)}</h3>}
        <span className='node-text'>{url}</span>
        <div className='row centered'>
            <h2>{value}</h2>
            {value !== "N/A" ? (
                <>
                    <ReactTooltip />
                    <span
                        className={isSyncing ? "sync-progress-icon" : "success-icon"}
                        data-tip={isSyncing ? "Syncing" : "Synced"}
                    />
                </>
            ) : null}
        </div>
        <span className='node-text time'>{isSyncing ? "Slot" : "Slot height"}</span>
    </div>
);
