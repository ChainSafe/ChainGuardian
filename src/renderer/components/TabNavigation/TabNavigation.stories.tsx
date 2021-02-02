import * as React from "react";
import {useState} from "react";
import {storiesOf} from "@storybook/react";
import {withKnobs, object} from "@storybook/addon-knobs";
import {TabNavigation} from "./TabNavigation";

storiesOf("Tab Navigation", module)
    .add("Tab Navigation", () => {
        const [selected, setSelected] = useState(1);

        // const selected= number("current", 1,);
        const d = [
            {
                tabId: 1,
                tabName: "Validator Stats",
            },
            {
                tabId: 2,
                tabName: "Beacon Node",
            },
            {
                tabId: 3,
                tabName: "Beacon Node",
            },
        ];
        const array = object("steps", d);
        return <TabNavigation onTab={(tab): void => setSelected(tab)} tabs={array} current={selected} />;
    })
    .addDecorator(withKnobs);
