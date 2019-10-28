import {Application} from "spectron";
import {setApp} from "./setupTest";

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

    it("opens the window", async () => {
        const {client, browserWindow} = app;

        await client.waitUntilWindowLoaded();
        const title = await browserWindow.getTitle();

        expect(title).toBe("ChainGuardian");
    });

    it("buttons load text", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        const goButtonText = await client.getAttribute("#go", "textContent");
        expect(goButtonText).toBe("GO");
        const registerButtonText = await client.getAttribute("#register", "textContent");
        expect(registerButtonText).toBe("REGISTER");
    }
    );

    it("input field test", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.addValue(".inputform", "testinput");
        const inputValue = await client.getValue(".inputform");
        
        expect(inputValue).toBe("testinput");
    }
    );
});
