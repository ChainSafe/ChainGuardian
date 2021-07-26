import {ButtonPrimary} from "../Button/ButtonStandard";
import * as React from "react";
import {PrivateKeyField} from "../PrivateKeyField/PrivateKeyField";
import {ICGKeystore} from "../../services/keystore";

interface IPrivateKeyPromp {
    keystore: ICGKeystore;
    display: boolean;
    onClose: () => void;
}

export const PrivateKeyPromp: React.FC<IPrivateKeyPromp> = ({keystore, display, onClose}) => (
    <div className={`prompt-overlay ${display ? "prompt-show" : "prompt-hide"}`}>
        <div className='prompt-modal'>
            <h2 className='prompt-title'>View Private Key</h2>
            <PrivateKeyField keystore={keystore} />
            <div className='button-control' style={{justifyContent: "center"}}>
                <ButtonPrimary onClick={onClose}>Close</ButtonPrimary>
            </div>
        </div>
    </div>
);
