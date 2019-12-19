import * as React from "react";
import * as renderer from "react-test-renderer";
import {ResponseCodeError} from "../../src/renderer/components/ResponseCodeError/ResponseCodeError";

const giveData = async (): Promise<Array<object>> => {
    return [{name: "Success", value: 400},{name: "Warning", value: 200},{name: "Error", value: 2},];
};

describe("ResponseCodeError", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ResponseCodeError 
                getData={giveData}
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});