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

    it.skip("should fail invalid inputs", async () => {
        const {client} = app;

        // password too short and invalid
        await client.setValue("#inputPassword", "pass");
        let errorMessage = await client.getText("#inputPassword-error");
        expect(errorMessage).to.be.equal(
            // eslint-disable-next-line max-len
            "Password must have at least 8 characters and contain at least 1 uppercased letter and 1 number and 1 symbol"
        );

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // password invalid
        await client.setValue("#inputPassword", "password");
        errorMessage = await client.getText("#inputPassword-error");
        expect(errorMessage).to.be.equal(
            // eslint-disable-next-line max-len
            "Password must contain at least 1 uppercased letter and 1 number and 1 symbol"
        );

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // confirm password doesn't match
        await client.setValue("#confirmPassword", "pass");
        errorMessage = await client.getText("#confirmPassword-error");
        expect(errorMessage).to.be.equal(
            // eslint-disable-next-line max-len
            "That password doesn't match. Try again?"
        );

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");
    });


    it.skip("should work valid inputs", async () => {
        const {client} = app;

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // valid password
        await client.setValue("#inputPassword", "Passw0rd!");
        let errorMessage = await client.getText("#inputPassword-error");
        expect(errorMessage).to.be.equal("");

        // next button disabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq("true");

        // valid confirmation password
        await client.setValue("#confirmPassword", "Passw0rd!");
        errorMessage = await client.getText("#confirmPassword-error");
        expect(errorMessage).to.be.equal("");

        // next button enabled
        expect(await client.getAttribute("#next", "disabled")).to.be.eq(null);
    });

});
