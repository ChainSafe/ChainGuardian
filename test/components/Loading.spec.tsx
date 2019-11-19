import * as React from "react";
import * as renderer from "react-test-renderer";
import {Loading} from "../../src/renderer/components/Loading/Loading";

describe("Loading", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<Loading visible title="Loading..."></Loading >)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});