import * as React from "react";


export interface IValidatorStatsProps {
    text: Array<string>,
    percent: number
}

export const ValidatorStats: React.FunctionComponent<IValidatorStatsProps> = (
    props: IValidatorStatsProps) => {

        return(
            <div className="stats-container">
                <h5>{props.text[0]}</h5>
                <h2>{props.percent}</h2>
                <h5>{props.text[1]}</h5>
            </div>
        );
}