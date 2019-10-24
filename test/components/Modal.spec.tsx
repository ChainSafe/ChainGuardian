import * as React from "react";
import * as renderer from "react-test-renderer";
import {Modal} from "../../src/renderer/components/Modal/Modal";

describe("InputForm", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<Modal></Modal>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders back button", () => {
        const tree = renderer
            .create(<Modal hasBack ></Modal>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});