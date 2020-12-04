import fs from "fs";
import sinon from "sinon";
import {ICGKeystore, V4Keystore} from "../../../../src/renderer/services/keystore";
import example from "./example.v4.json";
import {init, SecretKey} from "@chainsafe/bls";
import {BlsKeypair} from "../../../../src/renderer/types/keys";

const privateKey = "1c42e21991705982c6bbd771953fb3a2204b8e01fc7bf075bf4c26fa0aa3ee62";
const privateKeyStr = `0x${privateKey}`;

const keyStoreFilePath = `keystore-${Math.random() * 1000}.json`;
const password = "test";
const newPassword = "newTest";

describe("V4Keystore", () => {
    let v4Keystore: ICGKeystore;
    let sandbox: sinon.SinonSandbox;
    let unlinkStub: sinon.SinonStub;

    beforeEach(async () => {
        await init("herumi");
        sandbox = sinon.createSandbox();
        sandbox.stub(fs, "existsSync").withArgs(keyStoreFilePath).returns(true);
        sandbox.stub(fs, "writeFileSync");
        sandbox
            .stub(fs, "readFileSync")
            .withArgs(keyStoreFilePath)
            .returns(await JSON.stringify(example));
        unlinkStub = sandbox.stub(fs, "unlinkSync").withArgs(keyStoreFilePath).returns();
        const priv = SecretKey.fromHex(privateKey);
        const keypair: BlsKeypair = {
            privateKey: priv,
            publicKey: priv.toPublicKey(),
        };

        v4Keystore = await V4Keystore.create(keyStoreFilePath, password, keypair, "unknown");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should verify password", async () => {
        expect(await v4Keystore.verifyPassword(password)).toBeTruthy();
        expect(await v4Keystore.verifyPassword(newPassword)).toBeFalsy();
    });

    it("should decrypt", async () => {
        const keypair = await v4Keystore.decrypt(password);
        expect(keypair.privateKey.toHex()).toEqual(privateKeyStr);
    });

    it("should fail on decrypt with wrong password", async () => {
        await expect(v4Keystore.decrypt("wrongPassword")).rejects.toThrow("Invalid password");
    });

    it("should get private key with changed password", async () => {
        await v4Keystore.changePassword(password, newPassword);
        const keypair = await v4Keystore.decrypt(newPassword);
        expect(keypair.privateKey.toHex()).toEqual(privateKeyStr);
    }, 10000);

    it("should fail to encrypt private key with old password", async () => {
        await v4Keystore.changePassword(password, newPassword);
        await expect(v4Keystore.decrypt(password)).rejects.toThrow("Invalid password");
    }, 10000);

    it("should destroy file", () => {
        v4Keystore.destroy();
        expect(unlinkStub.calledOnce).toEqual(true);
    });
});
