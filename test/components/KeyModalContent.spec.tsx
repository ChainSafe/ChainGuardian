import * as React from "react";
import * as renderer from "react-test-renderer";
import KeyModalContent from "../../src/renderer/components/KeyModalContent/KeyModalContent";

describe("KeyModalContent", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <KeyModalContent
                    title='Test'
                    onSubmit={(): void => {}}
                    placeholder='Test placeholder'></KeyModalContent>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders description", () => {
        const tree = renderer
            .create(
                <KeyModalContent
                    title='Test'
                    onSubmit={(): void => {}}
                    description='Test description'
                    placeholder='Test placeholder'
                />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
