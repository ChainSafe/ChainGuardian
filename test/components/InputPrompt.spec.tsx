import * as renderer from "react-test-renderer";
import * as React from "react";
import {InputPrompt, ISubmitStatus} from "../../src/renderer/components/Prompt/InputPrompt";

describe("Input prompt", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<InputPrompt
                title={"Make input"}
                display={true}
                onSubmit={async (): Promise<ISubmitStatus> => {return {valid: true};}}
                onCancel={(): void => {}}
            >
            </InputPrompt >)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});