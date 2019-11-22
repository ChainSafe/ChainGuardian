import * as React from "react";
import * as renderer from "react-test-renderer";
import {Validator} from "../../src/renderer/components/Validator/Validator";

describe("Validator", () => {
    it("renders correctly, 2 nodes", () => {
        const tree = renderer
            .create(<Validator
                name={"Test title"}
                onBeaconNodeClick={(): void=>console.log("")} 
                onDetailsClick={(): void=>console.log("")} 
                onRemoveClick={(): void=>console.log("")} 
                onAddNodeClick={(): void=>console.log("")}
                stats={{
                    roi: 10,
                    balance: 0.1206,
                    uptime: 92.1
                }} 
                beaconNodes={[{
                    id: "BeaconNode1",
                    url: "rocketsonic1.hr",
                    respTime: 21
                },
                {
                    id: "BeaconNode2",
                    url: "rocketsonic2.hr",
                    respTime: 22
                }]}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, 4 nodes", () => {
        const tree = renderer
            .create(<Validator
                name={"Test title"}
                onBeaconNodeClick={(): void=>console.log("")} 
                onDetailsClick={(): void=>console.log("")} 
                onRemoveClick={(): void=>console.log("")} 
                onAddNodeClick={(): void=>console.log("")}
                stats={{
                    roi: 10,
                    balance: 0.1206,
                    uptime: 92.1
                }} 
                beaconNodes={[{
                    id: "BeaconNode1",
                    url: "rocketsonic1.hr",
                    respTime: 21
                },
                {
                    id: "BeaconNode2",
                    url: "rocketsonic2.hr",
                    respTime: 22
                },
                {
                    id: "BeaconNode3",
                    url: "rocketsonic2.hr",
                    respTime: 22
                },
                {
                    id: "BeaconNode4",
                    url: "rocketsonic2.hr",
                    respTime: 22
                }]}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});