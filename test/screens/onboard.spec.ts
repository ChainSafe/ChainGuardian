import path from "path";
import {Application} from "spectron";

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

    it("register button click", async () => {
        const {client} = app;

        await client.waitUntilWindowLoaded();
        return client.$("button=REGISTER").click().then(async () => {
            let url = await client.getUrl();
            url = url.split("#")[1];
            expect(url).toEqual("/onboard");
        });
    });

    it("back button click", async () => {
        const {client, browserWindow} = app;
        let urlIndex = await client.getUrl();
        urlIndex = urlIndex.split("#")[0];

        return browserWindow.loadURL(urlIndex+"#/onboard").then(async () => {
            return client.$("//button[@class='back-tab']").click().then(async () => {
                let url = await client.getUrl();
                url = url.split("#")[1];
                expect(url).toEqual("/login");
            });
        });


    });

});