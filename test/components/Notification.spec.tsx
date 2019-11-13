import * as React from "react";
import * as renderer from "react-test-renderer";
import {Notification} from "../../src/renderer/components/Notification/Notification";
import {Level, Horizontal, Vertical} from "../../src/renderer/components/Notification/NotificationEnums";

describe("Notification", () => {
    it("renders info top left", () => {
        const tree = renderer
            .create(<Notification 
                title="Test Title"
                isVisible={true}
                level={Level.INFO}
                horizontalPosition={Horizontal.LEFT}
                verticalPosition={Vertical.TOP}
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
                level={Level.ERROR}
                horizontalPosition={Horizontal.RIGHT}
                verticalPosition={Vertical.BOTTOM}
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
                level={Level.INFO}
                horizontalPosition={Horizontal.RIGHT}
                verticalPosition={Vertical.BOTTOM}
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
                level={Level.INFO}
                horizontalPosition={Horizontal.CENTER}
                verticalPosition={Vertical.CENTER}
                onClose={(): void=>{}}>
                Test text for notification commponent
            </Notification>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});