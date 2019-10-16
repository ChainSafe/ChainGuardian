import * as React from "react";
import {useState} from "react";

export interface IInputFormProps  {
    text?: string;
    label?: string;
    valid?: boolean;
    error?: string;
}

export const InputForm: React.FunctionComponent<IInputFormProps> = (initalData) => {
    const [input, setInput] = useState<IInputFormProps>(initalData)
    
    return(
        <form>
            <label></label>
            <input className="inputform" onChange={e => setInput({...input, text: e.target.value})} />
        </form>
    );
};
