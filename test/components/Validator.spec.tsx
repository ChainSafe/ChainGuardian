import * as React from "react";
import * as renderer from "react-test-renderer";
import {Validator} from "../../src/renderer/components/Validator/Validator";
// import {ValidatorSimple} from "../../src/renderer/components/Validator/ValidatorSimple";

describe("Validator", () => {
    it("renders correctly, 2 nodes", () => {
        const tree = renderer
            .create(<Validator
                name={"Test title"}
                onBeaconNodeClick={(): void=>{}} 
                onDetailsClick={(): void=>{}} 
                onRemoveClick={(): void=>{}} 
                onAddNodeClick={(): void=>{}}
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
                onBeaconNodeClick={(): void=>{}} 
                onDetailsClick={(): void=>{}} 
                onRemoveClick={(): void=>{}} 
                onAddNodeClick={(): void=>{}}
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
    
    // TEMP - Test suite failed to run
    //      TypeError: Cannot read property 'randomBytes' of undefined
    //       > 5 | import {Keystore, IKeystore} from "@nodefactory/bls-keystore";
    //
    //
    // it("renders correctly, Validator simple", () => {
    //     const tree = renderer
    //         .create(<ValidatorSimple
    //             name={"Validator 002"}
    //             status={"Not working"}
    //             publicKey={"6ffa3d24c9c26877d4a8bfa87455f44666ce93b7e13a3f84"}
    //             deposit={20.345}
    //             onExportClick={(): void=>{}} 
    //             onRemoveClick={(): void=>{}} 
    //             privateKey="6ffb3d24c9c26877d4a8bfa87455f44666ce93b7e13a3f84"
    //         />)
    //         .toJSON();
    //     expect(tree).toMatchSnapshot();
    // });
});


