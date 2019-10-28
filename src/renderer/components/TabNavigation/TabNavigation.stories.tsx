import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, object } from '@storybook/addon-knobs';
import { TabNavigation } from "./TabNavigation";

storiesOf('Tab Navigation', module).add('Tab Navigation', () => {
    const selected= number("current", 1,);
    const d = [
        {
            tabId: 1,
            tabName:"Validator Stats"
        },
        {
            tabId: 2,
            tabName:"Beacon Node"
        },
        {
            tabId: 3,
            tabName:"Beacon Node"
        },
    ];
    const array = object("steps", d);
    return <div >
            <TabNavigation tabs={array} current={selected}/>
        </div>;
}).addDecorator(withKnobs);