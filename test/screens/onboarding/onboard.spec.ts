import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {OnBoardingRoutes, Routes} from "../../../src/renderer/constants/routes";

jest.setTimeout(TIMEOUT);

describe("Onboarding start screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("has rendered properly", async function () {
        const {client} = app;
        expect(await (await client.$(".back-tab")).isExisting()).to.be.true;
        expect((await (await client.$(".step")).getValue()).length).to.be.equal(3);
        const goButtonText = await client.getElementAttribute("#file", "textContent");
        expect(goButtonText).to.be.equal("KEYSTORE");
        const registerButtonText = await client.getElementAttribute("#mnemonic", "textContent");
        expect(registerButtonText).to.be.equal("MNEMONIC OR PRIVATE KEY");
        const currentStep = await client.getElementAttribute(".step.current", "textContent");
        expect(currentStep).to.be.equal("Signing key");
    });
});
