import React, {ReactElement, useState} from "react";
import {useDispatch} from "react-redux";
import {networksList} from "../../services/eth2/networks";
import {Dropdown} from "../Dropdown/Dropdown";
import {selectNetwork} from "../../ducks/network/actions";

export const NetworkDropdown = (): ReactElement => {
    const [currentNetworkIndex, setCurrentNetworkIndex] = useState<number>(0);
    const networkOptions = ["All networks", ...networksList];
    const dispatch = useDispatch();

    const onChange = (selected: number): void => {
        setCurrentNetworkIndex(selected);
        dispatch(selectNetwork(networkOptions[selected]));
    };

    return (
        <div className={"validator-dropdown"}>
            <Dropdown options={networkOptions} current={currentNetworkIndex} onChange={onChange} />
        </div>
    );
};
