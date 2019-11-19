import * as React from "react";
import * as renderer from "react-test-renderer";
import {Dropdown} from "../../src/renderer/components/Dropdown/Dropdown";

describe("Dropdown", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<Dropdown 
                onChange={(selected): void=>(console.log(selected))} 
                current={0} 
                options={["All networks","Mainnet","Testnet","Networkname #1"]} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});