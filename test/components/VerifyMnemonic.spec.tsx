import * as React from "react";
import * as renderer from "react-test-renderer";
import {VerifyMnemonic} from "../../src/renderer/components/VerifyMnemonic/VerifyMnemonic";

describe("Verify Mnemonic", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<VerifyMnemonic 
                question="Test question?"
                answers={["Accept","Call","Iguanas"]}
                correctAnswer="Iguanas"
                onCorrectAnswer={(): void => console.log("correct")}
                onInvalidAnswer={(): void => console.log("invalid")}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});