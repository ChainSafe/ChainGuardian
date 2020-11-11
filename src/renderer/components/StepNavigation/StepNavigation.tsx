import * as React from "react";

export interface IStepNavigationProps {
    steps: Array<{stepId: number; stepName: string}>;
    current: number;
}

export const StepNavigation: React.FunctionComponent<IStepNavigationProps> = (props: IStepNavigationProps) => {
    return (
        <div id='step-navigation' className='step-container'>
            {props.steps.map((n) => {
                return (
                    <div className={`step ${props.current >= n.stepId ? "current" : ""}`} key={n.stepId}>
                        {n.stepName}
                    </div>
                );
            })}
        </div>
    );
};
