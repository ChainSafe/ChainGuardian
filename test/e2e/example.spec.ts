import path from "path";
import {Application} from "spectron";

jest.setTimeout(10000);

describe("Main window", () => {
    let app: Application;

    beforeEach(async () => {
        try {
            app = new Application({
                path: path.join(__dirname, "../../node_modules/.bin/electron"),
                args: [path.join(__dirname, "..", "..")],
                startTimeout: 10000,
                chromeDriverArgs: ["--no-sandbox", "--headless", "--disable-extensions", "--disable-infobars"]
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
