import path from "path";
import * as electronPath from "electron";
import {Application} from "spectron";

jest.setTimeout(10000);

describe("Main window", () => {
    let app: Application;

    beforeEach(() => {
        try {
            // @ts-ignore
            console.log("electorn path", electronPath.default);
            app = new Application({
                // @ts-ignore
                path: electronPath.default,
                args: [path.join(__dirname, "..", "..")]
            });

            return app.start();
        } catch (e) {
            console.log(e);
        }
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it("opens the window", async () => {
        const {client, browserWindow} = app;

        await client.waitUntilWindowLoaded();
        const title = await browserWindow.getTitle();

        expect(title).toBe("Webpack App");
    });

    it("increments the counter", async () => {
        const {client} = app;

        await client.waitUntilWindowLoaded();
        await client.click("#increment");

        const counterText = await client.getText("#counter-value");

        expect(counterText).toBe("Current value: 1");
    });

    it("decrements the counter", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.click("#decrement");

        const counterText = await client.getText("#counter-value");

        expect(counterText).toBe("Current value: -1");
    });
});
