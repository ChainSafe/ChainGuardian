import * as React from "react";
import * as renderer from "react-test-renderer";
import {InputForm} from "../../src/renderer/components/Input/InputForm";

describe("InputForm", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<InputForm label="Input" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders success", () => {
        const tree = renderer
            .create(<InputForm valid label="Input" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders error and message", () => {
        const tree = renderer
            .create(<InputForm valid={false} label="Input" errorMessage="Error message"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});