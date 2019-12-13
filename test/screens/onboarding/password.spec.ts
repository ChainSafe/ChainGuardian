import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {OnBoardingRoutes, Routes} from "../../../src/renderer/constants/routes";

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
        expect(await client.isExisting("#password")).to.be.true;
        expect(await client.isExisting("#confirm")).to.be.true;
        expect((await client.elements(".step")).value.length).to.be.equal(5);
        const inputPlaceholder = await client.getAttribute("#password", "placeholder");
        expect(inputPlaceholder).to.be.equal("Enter password");
        const confirmPlaceholder = await client.getAttribute("#confirm", "placeholder");
        expect(confirmPlaceholder).to.be.equal("Confirm password");
        const currentStep: [] = await client.getAttribute(".step.current", "textContent");
        expect(currentStep.length).to.be.equal(4);
    });

    it("should fail invalid inputs", async () => {
        const {client} = app;

        // password too short and invalid
        await client.setValue("#password", "pass");
        let errorMessage = await client.getText("#password-error");
        expect(errorMessage).to.be.equal(
            // eslint-disable-next-line max-len
            "Password must be at least 6 characters long"
        );

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // password invalid
        await client.setValue("#password", "password");
        errorMessage = await client.getText("#password-error");
        expect(errorMessage).to.be.equal(
            // eslint-disable-next-line max-len
            "Password must contain: 1 uppercase, 1 lowercase, 1 numeric and 1 special character"
        );

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // password valid
        await client.setValue("#password", "Passw0rd1!");
        errorMessage = await client.getText("#password-error");
        expect(errorMessage).to.be.equal(
            // eslint-disable-next-line max-len
            ""
        );

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // confirm password doesn't match
        await client.setValue("#confirm", "pass");
        errorMessage = await client.getText("#confirm-error");
        expect(errorMessage).to.be.equal(
            // eslint-disable-next-line max-len
            "That password doesn't match. Try again?"
        );

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");
    });


    it("should work valid inputs", async () => {
        const {client} = app;

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // valid password
        await client.setValue("#password", "Passw0rd!");
        let errorMessage = await client.getText("#password-error");
        expect(errorMessage).to.be.equal("");

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // valid confirmation password
        await client.setValue("#confirm", "Passw0rd!");
        errorMessage = await client.getText("#confirm-error");
        expect(errorMessage).to.be.equal("");

        // next button enabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq(null);
    });

});
