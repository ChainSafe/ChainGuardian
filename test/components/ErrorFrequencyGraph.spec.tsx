import * as React from "react";
import * as renderer from "react-test-renderer";
import {ErrorFrequencGraph} from "../../src/renderer/components/ErrorFrequencyGraph/ErrorFrequencyGraph";

const giveData = async (): Promise<number[]> => {
    return [2, 5, 9, 12, 1, 5, 6, 8, 10, 10, 11, 5, 7, 8];
};

describe("ErrorFrequencGraph", () => {
    it("renders correctly", () => {
        const tree = renderer.create(<ErrorFrequencGraph getData={giveData} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
