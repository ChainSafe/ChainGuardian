import * as React from "react";
import * as renderer from "react-test-renderer";
import {Notification, level, horizontal, vertical} from "../../src/renderer/components/Notification/Notification";

describe("Notification", () => {
    it("renders info top left", () => {
        const tree = renderer
            .create(<Notification 
                title="Test Title"
                isVisible={true}
                level={level.info}
                horizontalPosition={horizontal.left}
                verticalPosition={vertical.top}
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
                level={level.error}
                horizontalPosition={horizontal.right}
                verticalPosition={vertical.bottom}
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
                level={level.info}
                horizontalPosition={horizontal.right}
                verticalPosition={vertical.bottom}
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
                level={level.info}
                horizontalPosition={horizontal.center}
                verticalPosition={vertical.center}
                onClose={(): void=>{}}>
                Test text for notification commponent
            </Notification>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});