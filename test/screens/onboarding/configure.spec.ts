import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {OnBoardingRoutes, Routes} from "../../../src/renderer/constants/routes";

jest.setTimeout(TIMEOUT);

describe("Onboarding configure screens", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("has rendered properly", async function () {
        const {client} = app;
        expect(await (await client.$(".back-tab")).isExisting()).to.be.true;
        expect(await (await client.$(".dropdown-container")).isExisting()).to.be.true;
        const runButtonText = await client.getElementAttribute("#run-node", "textContent");
        expect(runButtonText).to.be.equal("RUN OWN NODE");
        const goButtonText = await client.getElementAttribute("#go", "textContent");
        expect(goButtonText).to.be.equal("GO");
        const inputPlaceholder = await client.getElementAttribute("#beaconURL", "placeholder");
        expect(inputPlaceholder).to.be.equal("http://... beacon node URL");
    });

    it("should redirect to password since no withdrawal key", async () => {
        const {client} = app;
        await (await client.$("#run-node")).click();
        const beaconNodeUrl = await client.getUrl();
        expect(beaconNodeUrl.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE_BEACON_NODE))).to.be
            .true;

        await (await client.$("#next")).click();
        const url = await client.getUrl();
        expect(url.endsWith(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD))).to.be.true;
    });
});

describe("Onboarding configure screens from start", () => {
    it("should redirect to deposit with inserted withdrawal key", async () => {
        const appFromWithdrawal = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_KEY_VALIDATE));
        const {client} = appFromWithdrawal;

        // Process withdrawal key step
        await client.replaceValue(
            ".inputform",
            "0x92fffcc44e690220c190be41378baf6152560eb13fa73bdf8b45120b56096acc4b4e87a0e0b97f83e48f0ff4990daa18",
        );
        await (await client.$("#submit")).isDisplayed();
        await (await client.$("#submit")).click();
        // Process configure step with running node
        await (await client.$("#run-node")).isDisplayed();
        await (await client.$("#run-node")).click();
        // Process configure beacon chain with default values
        await (await client.$("#next")).isDisplayed();
        await (await client.$("#next")).click();

        const url = await client.getUrl();
        expect(url.endsWith(OnBoardingRoutes.DEPOSIT_TX)).to.be.true;
        await stopApp(appFromWithdrawal);
    });
});
