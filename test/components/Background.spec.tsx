import * as React from "react";
import * as renderer from "react-test-renderer";
import {Background} from "../../src/renderer/components/Background/Background";

describe("Background", () => {
    it("renders correctly", () => {
        const tree = renderer.create(<Background></Background>).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders basic background", () => {
        const tree = renderer.create(<Background basic></Background>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
