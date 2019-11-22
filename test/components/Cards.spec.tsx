import * as React from "react";
import * as renderer from "react-test-renderer";
import {ValidatorCard, NodeCard} from "../../src/renderer/components/Cards/Cards";

describe("Cards", () => {
    it("renders correctly, ValidatorCard, ROI", () => {
        const tree = renderer
            .create(<ValidatorCard 
                value={20} 
                textArray={["Return (ETH)","ROI"]}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, ValidatorCard, ETH", () => {
        const tree = renderer
            .create(<ValidatorCard 
                value={0.1405} 
                textArray={["Balance","ETH"]}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, ValidatorCard, days", () => {
        const tree = renderer
            .create(<ValidatorCard 
                value={45.3} 
                textArray={["Uptime","DAYS"]}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, NodeCard", () => {
        const tree = renderer
            .create(<NodeCard 
                onClick={(): void=>{console.log("");}} 
                value={21} 
                textArray={["BeaconNode","rocketsonic.hr"]}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});