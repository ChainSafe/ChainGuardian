import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {OnBoardingRoutes, Routes} from "../../../src/renderer/constants/routes";
import {IMPORT_SIGNING_KEY_PLACEHOLDER} from "../../../src/renderer/constants/strings";

jest.setTimeout(TIMEOUT);

describe("Onboarding password setup screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("has rendered properly", async function () {
        const {client} = app;
        expect(await client.isExisting(".back-tab")).to.be.true;
        expect(await client.isExisting("#inputPassword")).to.be.true;
        expect(await client.isExisting("#confirmPassword")).to.be.true;
        expect((await client.elements(".step")).value.length).to.be.equal(5);
        const inputPlaceholder = await client.getAttribute("#inputPassword", "placeholder");
        expect(inputPlaceholder).to.be.equal("Enter password");
        const confirmPlaceholder = await client.getAttribute("#confirmPassword", "placeholder");
        expect(confirmPlaceholder).to.be.equal("Confirm password");
        const currentStep: [] = await client.getAttribute(".step.current", "textContent");
        expect(currentStep.length).to.be.equal(3);
    });

    // it("should fail invalid inputs", async () => {
    //     const {client} = app;
    //
    //     // Invalid mnemonic
    //     await client.setValue(".inputform", "test mnemonic");
    //     let errorMessage = await client.getText(".error-message");
    //     expect(errorMessage).to.be.equal(INVALID_MNEMONIC_MESSAGE);
    //
    //     // Invalid key length
    //     await client.setValue(".inputform", "0xadfa");
    //     errorMessage = await client.getText(".error-message");
    //     expect(errorMessage).to.be.equal(PRIVATE_KEY_WRONG_LENGTH_MESSAGE);
    //
    //     // Invalid charactes in key
    //     await client.setValue(".inputform", "0xasdf*=");
    //     errorMessage = await client.getText(".error-message");
    //     expect(errorMessage).to.be.equal(KEY_WRONG_CHARACTERS_MESSAGE);
    // });
    //
    //
    // it("should work valid inputs", async () => {
    //     const {client} = app;
    //
    //     // Valid key
    //     await client.setValue(".inputform", privateKeyStr);
    //     let errorMessage = await client.getText(".error-message");
    //     expect(errorMessage).to.be.equal("");
    //
    //     // Valid mnemonic
    //     await client.setValue(".inputform", mnemonic);
    //     errorMessage = await client.getText(".error-message");
    //     expect(errorMessage).to.be.equal("");
    // });
    //
    // it("should not submit if error message exists", async () => {
    //     const {client} = app;
    //
    //     // User enter invalid mnemonic
    //     await client.setValue(".inputform", "test mnemonic");
    //
    //     const preClickUrl = await client.getUrl();
    //     await client.waitForVisible("#submit");
    //     await client.$("#submit").click();
    //     let postClickUrl = await client.getUrl();
    //     expect(preClickUrl).to.be.equal(postClickUrl);
    //
    //     // Useer enter valid mnemonic
    //     await client.setValue(".inputform", mnemonic);
    //     await client.$("#submit").click();
    //     postClickUrl = await client.getUrl();
    //     expect(postClickUrl.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(
    //         OnBoardingRoutes.WITHDRAWAL_IMPORT
    //     ))).to.be.true;
    // });

});
