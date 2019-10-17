import path from "path";
import {Application} from "spectron";

jest.setTimeout(10000);

describe("Main window", () => {
    let app: Application;

    beforeEach(async () => {
        try {
            const isWin = process.platform === "win32";
            app = new Application({
                path: path.join(__dirname, "../../node_modules/.bin/electron" + isWin ? ".cmd" : ""),
                args: [path.join(__dirname, "..", "..")],
                startTimeout: 5000
            });
            await app.start();
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
