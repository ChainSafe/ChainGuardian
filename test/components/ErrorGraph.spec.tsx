import * as React from "react";
import * as renderer from "react-test-renderer";
import {ErrorGraph} from "../../src/renderer/components/ErrorGraph/ErrorGraph";

const giveData = async (): Promise<number[]> => {
    return [2,5,9,12,1,5,6,8,10,10,11,5,7,8];
};

describe("ErrorGraph", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ErrorGraph 
                getData={giveData}
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});