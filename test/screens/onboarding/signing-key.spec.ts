import {setApp} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {Routes, Subroutes} from "../../../src/renderer/constants/routes";

jest.setTimeout(15000);

const mnemonic = "hard caught annual spread green step avocado shine scare warm chronic pond";
const privateKeyStr = "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259";

describe("Onboarding signing key import screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(Subroutes.SIGNING, Subroutes.SIGNING_IMPORT));
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });
    
    it("has rendered properly", async function() {
        const {client} = app;
        expect(await client.isExisting(".back-tab")).to.be.true;
        expect(await client.isExisting("#inputKey")).to.be.true;
        expect((await client.elements(".step")).value.length).to.be.equal(5);
        const placeholder = await client.getAttribute("#inputKey", "placeholder");
        expect(placeholder).to.be.equal("Enter your unique mnemonic signing key");
        const currentStep = await client.getAttribute(".step.current", "textContent");
        expect(currentStep).to.be.equal("Signing key");
    });

    it('should fail invalid mnemonic', async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.addValue(".inputform", "test mnemonic");
        const errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal("Invalid mnemonic");
    });


    it('should fail private key not correct length', async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.addValue(".inputform", "0xasdfag");
        const errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal("Private key should have 32 bytes");
    });

    it('should fail private key contains not alphanumerical characters', async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.addValue(".inputform", "0xasdf*=")
        const errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal("Private key must contain alphanumerical characters only");
    });
    
    it('should work private key correct', async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.addValue(".inputform", privateKeyStr)
        const errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal("");
    });

    it('should work mnemonic correct', async () => {
        const {client} = app;
        await client.waitUntilWindowLoaded();
        await client.addValue(".inputform", mnemonic)
        const errorMessage = await client.getText(".error-message");
        expect(errorMessage).to.be.equal("");
    });
});
