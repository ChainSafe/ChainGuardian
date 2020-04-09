import React, {ReactElement, useState} from "react";
import {useDispatch} from "react-redux";
import {saveSelectedNetworkAction} from "../../actions/network";
import {networksList} from "../../services/eth2/networks";
import {Dropdown} from "../Dropdown/Dropdown";

export const NetworkDropdown = (): ReactElement => {
    const [currentNetworkIndex, setCurrentNetworkIndex] = useState<number>(0);
    const networkOptions = ["All networks", ...networksList];
    const dispatch = useDispatch();

    const onChange = (selected: number): void => {
        setCurrentNetworkIndex(selected);
        dispatch(saveSelectedNetworkAction(networkOptions[selected]));
    };

    return (
        <div className={"validator-dropdown"}>
            <Dropdown
                options={networkOptions}
                current={currentNetworkIndex}
                onChange={onChange}
            />
        </div>
    );
};
