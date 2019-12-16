import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {Routes} from "../../../src/renderer/constants/routes";

jest.setTimeout(TIMEOUT);

describe("Dashboard simple screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.DASHBOARD_ROUTE);
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("has rendered properly", async function() {
        const {client} = app;
        expect(await client.isExisting(".validators-display")).to.be.true;
        expect((await client.elements(".validator-wrapper")).value.length).to.be.greaterThan(0);
        const goButtonText = await client.getAttribute("#add-validator", "textContent");
        expect(goButtonText).to.be.equal("ADD NEW VALIDATOR");
        expect(await client.isExisting(".validator-dropdown")).to.be.true;
    });

});
