import * as React from "react";
import * as renderer from "react-test-renderer";

import {ButtonPrimitive} from "../../src/renderer/components/Button/ButtonStandard";

describe("ButtonPrimitive", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ButtonPrimitive>Submit</ButtonPrimitive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders disabled button", () => {
        const tree = renderer
            .create(<ButtonPrimitive disabled={true}>Submit</ButtonPrimitive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders focused button", () => {
        const tree = renderer
            .create(<ButtonPrimitive focused={true}>Submit</ButtonPrimitive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});