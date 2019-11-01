import {setApp} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {Routes, OnBoardingRoutes} from "../../../src/renderer/constants/routes";
import {
    INVALID_MNEMONIC_MESSAGE,
    KEY_WRONG_LENGTH_MESSAGE,
    KEY_WRONG_CHARACTERS_MESSAGE
} from "../../../src/renderer/services/utils/input-utils";

jest.setTimeout(15000);

const mnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";
const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";

describe("Onboarding signing key import screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT));
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it("has rendered properly", async function () {
        const {client} = app;
        expect(await client.isExisting(".back-tab")).to.be.true;
        expect(await client.isExisting("#inputKey")).to.be.true;
        expect((await client.elements(".step")).value.length).to.be.equal(5);
        const placeholder = await client.getAttribute("#inputKey", "placeholder");
        expect(placeholder).to.be.equal("Enter your unique mnemonic signing key");
        const currentStep = await client.getAttribute(".step.current", "textContent");
        expect(currentStep).to.be.equal("Signing key");
    });

    it("should fail invalid inputs", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();

        // Invalid mnemonic
        await client.setValue(".inputform", "test mnemonic");
        let errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal(INVALID_MNEMONIC_MESSAGE);

        // Invalid key length
        await client.setValue(".inputform", "0xadfa");
        errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal(KEY_WRONG_LENGTH_MESSAGE);

        // Invalid charactes in key
        await client.setValue(".inputform", "0xasdf*=");
        errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal(KEY_WRONG_CHARACTERS_MESSAGE);
    });


    it("should work valid inputs", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();

        // Valid key
        await client.setValue(".inputform", privateKeyStr);
        let errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal("");
        
        // Valid mnemonic
        await client.setValue(".inputform", mnemonic);
        errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal("");
    });

    it("should not submit if error message exists", async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();

        // User enter invalid mnemonic
        await client.setValue(".inputform", "test mnemonic");

        const preClickUrl = await client.getUrl();
        await client.waitForVisible("#submit");
        await client.$("#submit").click();
        let postClickUrl = await client.getUrl();
        expect(preClickUrl).to.be.equal(postClickUrl);

        // Useer enter valid mnemonic
        await client.setValue(".inputform", mnemonic);
        await client.$("#submit").click();
        postClickUrl = await client.getUrl();
        expect(postClickUrl.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(
            OnBoardingRoutes.WITHDRAWAL_IMPORT
        ))).to.be.true;
    });

});
