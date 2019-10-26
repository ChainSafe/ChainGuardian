import * as React from "react";
import * as renderer from "react-test-renderer";
import {TabNavigation} from "../../src/renderer/components/TabNavigation/TabNavigation";

describe("TabNavigation", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<TabNavigation 
                current={1}
                tabs={
                    [
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
                    ]
                }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});