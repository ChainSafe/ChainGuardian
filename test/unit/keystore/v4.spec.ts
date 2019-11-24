import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import fs from "fs";
import sinon from "sinon";
import {ICGKeystore, V4Keystore} from "../../../src/renderer/services/keystore";
import example from "./example.v4.json";

const privateKey = "0e43429c844ccedd4aff7aaa05fe996f41f9464b360ca03a4349387ba49b3e18";
const privateKeyStr = `0x${privateKey}`;

const keyStoreFilePath = `${getV4Filename()}.json`;
const password = "test";
const newPassword = "newTest";

function getV4Filename(timestamp?: number): string {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return ["UTC--", ts.toJSON().replace(/:/g, "-"), "--", "uuid"].join("");
}

describe("V4Keystore", () => {
    let v4Keystore: ICGKeystore;
    let sandbox: sinon.SinonSandbox;
    let writeStub: sinon.SinonStub;
    let readStub: sinon.SinonStub;
    let unlinkStub: sinon.SinonStub;

    beforeAll(async () => {
        sandbox = sinon.createSandbox();
        sandbox.stub(fs, "existsSync").withArgs(keyStoreFilePath).returns(true);
        writeStub = sandbox.stub(fs, "writeFileSync");
        readStub = sandbox
            .stub(fs, "readFileSync")
            .withArgs(keyStoreFilePath)
            .returns(
                await JSON.stringify(example)
            );
        unlinkStub = sandbox
            .stub(fs, "unlinkSync")
            .withArgs(keyStoreFilePath)
            .returns();
    });

    beforeEach(async () => {
        const priv = PrivateKey.fromHexString(privateKey);
        const keypair = new Keypair(priv);
        v4Keystore = await V4Keystore.create(keyStoreFilePath, password, keypair);
    });

    afterAll(() => {
        sandbox.restore();
    });


    it("should create keystore", async () => {
        expect(writeStub.calledOnce).toEqual(true);
        expect(readStub.calledOnce).toEqual(true);
    });


    it("should decrypt", async () => {
        const keypair = await v4Keystore.decrypt(password);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    });

    it("should fail on decrypt with wrong password", async () => {
        await expect(v4Keystore.decrypt("wrongPassword"))
            .rejects
            .toThrow("Invalid password");
    });

    it("should get private key with changed password", async () => {
        await v4Keystore.changePassword(password, newPassword);
        const keypair = await v4Keystore.decrypt(newPassword);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    }, 10000);

    it("should fail to encrypt private key with old password", async () => {
        await v4Keystore.changePassword(password, newPassword);
        await expect(v4Keystore.decrypt(password))
            .rejects
            .toThrow("Invalid password");
    }, 10000);

    it("should destroy file", () => {
        v4Keystore.destroy();
        expect(unlinkStub.calledOnce).toEqual(true);
    });
});
