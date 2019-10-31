import * as React from "react";
import * as renderer from "react-test-renderer";
import KeyModalContent from "../../src/renderer/components/KeyModalContent/KeyModalContent";

describe("KeyModalContent", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<KeyModalContent title="Test" onSubmit={() => {}}></KeyModalContent>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders description", () => {
        const tree = renderer
            .create(<KeyModalContent title="Test" onSubmit={() => {}} description="Test description"></KeyModalContent>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});