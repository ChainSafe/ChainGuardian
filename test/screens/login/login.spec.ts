import {Application} from "spectron";
import {setApp, TIMEOUT} from "../setup";
import {Routes, OnBoardingRoutes} from "../../../src/renderer/constants/routes";

jest.setTimeout(TIMEOUT);

describe("Main window", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.LOGIN_ROUTE);
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it("buttons load text", async () => {
        const {client, browserWindow} = app;
        await client.waitUntilWindowLoaded();
        const title = await browserWindow.getTitle();
        expect(title).toBe("ChainGuardian");
        const goButtonText = await client.getAttribute("#go", "textContent");
        expect(goButtonText).toBe("GO");
        const registerButtonText = await client.getAttribute("#register", "textContent");
        expect(registerButtonText).toBe("REGISTER");
    });

    it("register button leads to onboarding", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.$("button=REGISTER").click().pause(500);
        const url = await client.getUrl();
        expect(url.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING))).toBeTruthy();
    });

    it("input field test", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.addValue(".inputform", "testinput");
        const inputValue = await client.getValue(".inputform");
        expect(inputValue).toBe("testinput");
    });

});
