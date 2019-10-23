import path from "path";
import {Application} from "spectron";

jest.setTimeout(15000);

describe("Main window", () => {
    let app: Application;

    beforeEach(async () => {
        try {
            const isWin = process.platform === "win32";
            let electronPath =  path.join(__dirname, "../../node_modules/.bin/electron");
            if(isWin) {
                electronPath += ".cmd";
            }
            app = new Application({
                path: electronPath,
                args: [path.join(__dirname, "..", "..")],
                waitTimeout: 15000,
                startTimeout: 15000,
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

    it("GO button loads", async () => {
        const {client} = app;

        //Property 'findElement' does not exist on type 'SpectronClient'.
        const goButtonSelected = await client.findElement(by.className("btn-secondary"));
        const goButtonText = await client.getText(goButtonSelected);
        expect(goButtonText).toBe("GO");
    }
    );

});
