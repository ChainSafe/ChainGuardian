import * as React from "react";
import {ButtonPrimary} from "../Button/ButtonStandard";
import {AddButton} from "../Button/ButtonAction";

export interface IValidatorProps {

}

export const Validator: React.FunctionComponent<IValidatorProps> = (
    props: IValidatorProps) => {



        return(
            <div className="validator-container">
                <div className="validator-stats">
                    <h2>Validator 001</h2>
                    
                </div>
                <div className="validator-nodes">
                    <div className="node-container">

                    </div>
                    <div className="validator-buttons">

                    </div>
                </div>
            </div>
        );
}