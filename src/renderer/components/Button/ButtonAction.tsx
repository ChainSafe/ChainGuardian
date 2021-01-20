import React, {useEffect, useState} from "react";
import arrow from "../../assets/img/buttons/Backtab.svg";
import add from "../../assets/img/buttons/Add.svg";
import copyDefault from "../../assets/img/buttons/CopyDefault.svg";
import ReactTooltip from "react-tooltip";
import {getRandomInt} from "../../services/mnemonic/utils/random";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface IActionButtonProps {
    onClick?: () => void;
}

export interface ICopyButtonProps {
    onClick: () => void;
}

export const BackTab: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return (
        <button className={"back-tab"} onClick={onClick}>
            <img className={"icon"} src={arrow} />
        </button>
    );
};

export const CopyButton: React.FunctionComponent<ICopyButtonProps> = (props: ICopyButtonProps) => {
    const [clicked, setClicked] = useState(false);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const handleClick = (): void => {
        props.onClick();
        const handleTimeout = (): void => {
            setClicked(false);
        };
        setClicked(true);
        setTimeoutId(window.setTimeout(handleTimeout, 1000));
    };

    useEffect(() => {
        return function cleanup(): void {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    });

    const toolTipId = `cg-tooltip-${getRandomInt(10000)}`;

    return (
        <button className={"copy-button"} onClick={handleClick}>
            <ReactTooltip
                id={toolTipId}
                effect='solid'
                place='right'
                getContent={(): string => {
                    return clicked ? "Copied!" : "Copy All";
                }}
            />
            <img
                alt='copy-button-icon'
                data-for={toolTipId}
                data-tip='Copy all'
                data-place='top'
                className={"icon copy"}
                src={copyDefault}
            />
        </button>
    );
};

export const AddButton: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return (
        <button className={"add-button"} onClick={onClick}>
            <img className={"icon"} src={add} />
        </button>
    );
};

export const EditButton: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return (
        <button className='add-button' onClick={onClick}>
            <FontAwesomeIcon className='icon' icon={faPen} size='lg' transform={{x: 1}} />
        </button>
    );
};

export const BackButton: React.FunctionComponent<IActionButtonProps> = ({onClick}) => {
    return (
        <button className={"back-button"} onClick={onClick}>
            <img className={"icon"} src={arrow} />
        </button>
    );
};
