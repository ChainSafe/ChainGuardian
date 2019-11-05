import * as React from "react";
import * as renderer from "react-test-renderer";
import {Notification} from "../../src/renderer/components/Notification/Notification";
import {level, horizontal, vertical} from "../../src/renderer/components/Notification/NotificationEnums";

describe("Notification", () => {
    it("renders info top left", () => {
        const tree = renderer
            .create(<Notification 
                title="Test Title"
                isVisible={true}
                level={level.INFO}
                horizontalPosition={horizontal.LEFT}
                verticalPosition={vertical.TOP}
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
                level={level.ERROR}
                horizontalPosition={horizontal.RIGHT}
                verticalPosition={vertical.BOTTOM}
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
                level={level.INFO}
                horizontalPosition={horizontal.RIGHT}
                verticalPosition={vertical.BOTTOM}
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
                level={level.INFO}
                horizontalPosition={horizontal.CENTER}
                verticalPosition={vertical.CENTER}
                onClose={(): void=>{}}>
                Test text for notification commponent
            </Notification>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});