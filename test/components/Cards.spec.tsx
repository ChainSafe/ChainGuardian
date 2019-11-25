import * as React from "react";
import * as renderer from "react-test-renderer";
import {ValidatorCard} from "../../src/renderer/components/Cards/ValidatorCard";
import {NodeCard} from "../../src/renderer/components/Cards/NodeCard";

describe("Cards", () => {
    it("renders correctly, ValidatorCard, ROI", () => {
        const tree = renderer
            .create(<ValidatorCard 
                value={20} 
                title="Return (ETH)"
                type="ROI"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, ValidatorCard, ETH", () => {
        const tree = renderer
            .create(<ValidatorCard 
                value={0.1405} 
                title="Balance"
                type="ETH"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, ValidatorCard, days", () => {
        const tree = renderer
            .create(<ValidatorCard 
                value={45.3} 
                title="Uptime"
                type="DAYS"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, NodeCard", () => {
        const tree = renderer
            .create(<NodeCard 
                onClick={(): void=>{console.log("");}} 
                value={21} 
                title="BeaconNode"
                url="rocketsonic.hr"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});