import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {Routes, OnBoardingRoutes} from "../../../src/renderer/constants/routes";
import {IMPORT_SIGNING_KEY_PLACEHOLDER} from "../../../src/renderer/constants/strings";
import {
    PRIVATE_KEY_WRONG_CHARACTERS_MESSAGE,
    MNEMONIC_INVALID_MESSAGE,
    PRIVATE_KEY_WRONG_LENGTH_MESSAGE
} from "../../../src/renderer/containers/Onboard/SigningKey/Import/validation";

jest.setTimeout(TIMEOUT);

const mnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";
const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";


describe("Onboarding signing key import screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT_MNEMONIC));
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("has rendered properly", async function () {
        const {client} = app;
        expect(await (await client.$(".back-tab")).isExisting()).to.be.true;
        expect(await (await client.$("#inputKey")).isExisting()).to.be.true;
        const placeholder = await client.getElementAttribute("#inputKey", "placeholder");
        expect(placeholder).to.be.equal(IMPORT_SIGNING_KEY_PLACEHOLDER);
        const currentStep = await client.getElementAttribute(".step.current", "textContent");
        expect(currentStep).to.be.equal("Signing key");
    });

    it("should fail invalid inputs", async () => {
        const {client} = app;

        // Invalid mnemonic
        await client.replaceValue(".inputform", "test mnemonic");
        let errorMessage = await client.getElementText(".error-message");
        expect(errorMessage).to.be.equal(MNEMONIC_INVALID_MESSAGE);

        // Invalid key length
        await client.replaceValue(".inputform", "0xadfa");
        errorMessage = await client.getElementText(".error-message");
        expect(errorMessage).to.be.equal(PRIVATE_KEY_WRONG_LENGTH_MESSAGE);

        // Invalid charactes in key
        await client.replaceValue(".inputform", "0xasdf*=");
        errorMessage = await client.getElementText(".error-message");
        expect(errorMessage).to.be.equal(PRIVATE_KEY_WRONG_CHARACTERS_MESSAGE);
    });


    it("should work valid inputs", async () => {
        const {client} = app;

        // Valid key
        await client.replaceValue(".inputform", privateKeyStr);
        let errorMessage = await client.getElementText(".error-message");
        expect(errorMessage).to.be.equal("");

        // Valid mnemonic
        await client.replaceValue(".inputform", mnemonic);
        errorMessage = await client.getElementText(".error-message");
        expect(errorMessage).to.be.equal("");
    });

    it("should not submit if error message exists", async () => {
        const {client} = app;

        // User enter invalid mnemonic
        await client.replaceValue(".inputform", "test mnemonic");

        const preClickUrl = await client.getUrl();
        await (await client.$("#submit")).isDisplayed();
        await (await client.$("#submit")).click();
        let postClickUrl = await client.getUrl();
        expect(preClickUrl).to.be.equal(postClickUrl);

        // Useer enter valid mnemonic
        await client.replaceValue(".inputform", mnemonic);
        await (await client.$("#submit")).click();
        postClickUrl = await client.getUrl();
        expect(postClickUrl.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(
            OnBoardingRoutes.DEPOSIT_TX
        ))).to.be.true;
    });

});

describe("Onboarding signing key validate screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_KEY_GENERATE));
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("should redirect to deposit flow on correct answer", async (done) => {
        const {client} = app;
        await (await client.$("#savedSigningMnemonic")).click();
        const verificationUrl = await client.getUrl();
        expect(verificationUrl.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(
            OnBoardingRoutes.SIGNING_KEY_VALIDATE
        ))).to.be.true;

        await (await client.$(".verify-button-container button[datafield=true]")).click();

        const timeoutHandler = async (): Promise<void> => {
            const url = await client.getUrl();
            expect(url.endsWith(OnBoardingRoutes.DEPOSIT_TX)).to.be.true;
            done();
        };
        setTimeout(timeoutHandler, 1500);
    });
});
