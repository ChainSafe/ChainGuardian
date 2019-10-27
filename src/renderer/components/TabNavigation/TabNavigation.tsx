import * as React from "react";

export interface ITabNavigationProps {
    tabs: Array<{tabId: number, tabName: string}>;
    current: number;
}

export const TabNavigation: React.FunctionComponent<ITabNavigationProps> = (props: ITabNavigationProps) => {

    return(
        <div className="tab-container">
            {props.tabs.map(n => {
                return <div 
                    className={`tab ${props.current === n.tabId ? "current-tab" : ""}`} 
                    key={n.tabId}>
                    {n.tabName}
                </div>;
            })}
        </div>
    );
};