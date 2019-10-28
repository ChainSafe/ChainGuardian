import {setApp} from "./setupTest";
import {Application} from "spectron";

jest.setTimeout(15000);

describe("Main window", () => {
    let app: Application;

    beforeEach(async () => {
        try {
            app = setApp();
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