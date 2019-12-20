import * as React from "react";
import * as renderer from "react-test-renderer";
import {CopyField, MnemonicCopyField} from "../../src/renderer/components/CopyField/CopyField";

describe("CopyField", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<CopyField onCopy={(): void => {}} value="Test text for copy"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("MnemonicCopyField", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<MnemonicCopyField onCopy={(): void => {}} value="mnemonic text for copy"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});