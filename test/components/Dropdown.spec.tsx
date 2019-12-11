import * as React from "react";
import * as renderer from "react-test-renderer";
import {Dropdown} from "../../src/renderer/components/Dropdown/Dropdown";

describe("Dropdown", () => {
    it("renders correctly with array of options", () => {
        const tree = renderer
            .create(<Dropdown 
                onChange={(selected): void=>(console.log(selected))} 
                current={0} 
                options={["All networks","Mainnet","Testnet","Networkname #1"]} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders correctly with options object", () => {
        const tree = renderer
            .create(<Dropdown
                onChange={(selected): void=>(console.log(selected))}
                current={0}
                options={{0: "All networks", 112: "Mainnet", 23: "Testnet", 41: "Networkname #1"}} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});