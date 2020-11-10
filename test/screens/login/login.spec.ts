import {Application} from "spectron";
import {setApp, stopApp, TIMEOUT} from "../setup";
import {OnBoardingRoutes, Routes} from "../../../src/renderer/constants/routes";

jest.setTimeout(TIMEOUT);

describe("Main window", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.LOGIN_ROUTE);
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("buttons load text", async () => {
        const {client, browserWindow} = app;
        const title = await browserWindow.getTitle();
        expect(title).toBe("ChainGuardian");
        const goButtonText = await client.getElementAttribute("#go", "textContent");
        expect(goButtonText).toBe("GO");
        const registerButtonText = await client.getElementAttribute("#register", "textContent");
        expect(registerButtonText).toBe("REGISTER");
    });

    it("register button leads to onboarding", async () => {
        const {client} = app;
        await (await client.$("button=REGISTER")).click();
        await client.pause(200);
        const url = await client.getUrl();
        expect(url.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING))).toBeTruthy();
    });

    it("input field test", async () => {
        const {client} = app;
        await client.replaceValue(".inputform", "testinput");
        const inputValue = await client.getElementValue(".inputform");
        expect(inputValue).toBe("testinput");
    });

});
