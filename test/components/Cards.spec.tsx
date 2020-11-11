import * as React from "react";
import * as renderer from "react-test-renderer";
import {ValidatorStat} from "../../src/renderer/components/Cards/ValidatorStat";
import {NodeCard} from "../../src/renderer/components/Cards/NodeCard";

describe("Cards", () => {
    it("renders correctly, ValidatorStat, ROI", () => {
        const tree = renderer.create(<ValidatorStat value={20} title='Return (ETH)' type='ROI' />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, ValidatorStat, ETH", () => {
        const tree = renderer.create(<ValidatorStat value={0.1405} title='Balance' type='ETH' />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, ValidatorStat, days", () => {
        const tree = renderer.create(<ValidatorStat value={45.3} title='Uptime' type='DAYS' />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders correctly, NodeCard", () => {
        const tree = renderer
            .create(<NodeCard onClick={(): void => {}} value={21} title='BeaconNode' url='rocketsonic.hr' />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
