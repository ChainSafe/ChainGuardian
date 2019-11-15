import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {Routes, OnBoardingRoutes} from "../../../src/renderer/constants/routes";
import {IMPORT_SIGNING_KEY_PLACEHOLDER} from "../../../src/renderer/constants/strings";
import {
    KEY_WRONG_CHARACTERS_MESSAGE,
    MNEMONIC_INVALID_MESSAGE,
    PRIVATE_KEY_WRONG_LENGTH_MESSAGE
} from "../../../src/renderer/containers/Onboard/SigningKey/Import/validation";

jest.setTimeout(TIMEOUT);

const mnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";
const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";

describe("Onboarding signing key import screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT));
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("has rendered properly", async function () {
        const {client} = app;
        expect(await client.isExisting(".back-tab")).to.be.true;
        expect(await client.isExisting("#inputKey")).to.be.true;
        expect((await client.elements(".step")).value.length).to.be.equal(5);
        const placeholder = await client.getAttribute("#inputKey", "placeholder");
        expect(placeholder).to.be.equal(IMPORT_SIGNING_KEY_PLACEHOLDER);
        const currentStep = await client.getAttribute(".step.current", "textContent");
        expect(currentStep).to.be.equal("Signing key");
    });

    it("should fail invalid inputs", async () => {
        const {client} = app;

        // Invalid mnemonic
        await client.setValue(".inputform", "test mnemonic");
        let errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal(MNEMONIC_INVALID_MESSAGE);

        // Invalid key length
        await client.setValue(".inputform", "0xadfa");
        errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal(PRIVATE_KEY_WRONG_LENGTH_MESSAGE);

        // Invalid charactes in key
        await client.setValue(".inputform", "0xasdf*=");
        errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal(KEY_WRONG_CHARACTERS_MESSAGE);
    });


    it("should work valid inputs", async () => {
        const {client} = app;

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
