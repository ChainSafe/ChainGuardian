import * as React from "react";
import * as renderer from "react-test-renderer";
import {Notification} from "../../src/renderer/components/Notification/Notification";

describe("Notification", () => {
    it("renders info top left", () => {
        const tree = renderer
            .create(<Notification 
                title="Test Title"
                isVisible={true}
                level="info"
                horizontalPosition="left"
                verticalPosition="top"
                onClose={(): void=>{}}>
                Test text for notification commponent
            </Notification>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders error bottom right", () => {
        const tree = renderer
            .create(<Notification 
                title="Test Title"
                isVisible={true}
                level="error"
                horizontalPosition="right"
                verticalPosition="bottom"
                onClose={(): void=>{}}>
                Test text for notification commponent
            </Notification>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders hidden notification", () => {
        const tree = renderer
            .create(<Notification 
                title="Test Title"
                isVisible={false}
                level="info"
                horizontalPosition="right"
                verticalPosition="bottom"
                onClose={(): void=>{}}>
                Test text for notification commponent
            </Notification>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders centered notification", () => {
        const tree = renderer
            .create(<Notification 
                title="Test Title"
                isVisible={true}
                level="info"
                horizontalPosition="center-horizontal"
                verticalPosition="center-vertical"
                onClose={(): void=>{}}>
                Test text for notification commponent
            </Notification>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});