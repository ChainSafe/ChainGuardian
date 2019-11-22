import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import fs from "fs";
import sinon from "sinon";
import {Eth2Keystore, ICGKeystore} from "../../../src/renderer/services/keystore";
import example from "./example.eth2.json";

const privateKey = "0e43429c844ccedd4aff7aaa05fe996f41f9464b360ca03a4349387ba49b3e18";
const privateKeyStr = `0x${privateKey}`;

const keyStoreFilePath = `${getV4Filename()}.json`;
const password = "test";
const newPassword = "newTest";

function getV4Filename(timestamp?: number): string {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return ["UTC--", ts.toJSON().replace(/:/g, "-"), "--", "uuid"].join("");
}

describe("Eth1ICGKeystore", () => {
    let eth2Keystore: ICGKeystore;
    let sandbox: sinon.SinonSandbox;

    beforeAll(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(fs, "existsSync").withArgs(keyStoreFilePath).returns(true);
    });

    afterAll(() => {
        sandbox.restore();
    });


    it("should create keystore", async () => {
        const priv = PrivateKey.fromHexString(privateKey);
        const keypair = new Keypair(priv);

        const writeStub = sandbox.stub(fs, "writeFileSync");
        const readStub = sandbox
            .stub(fs, "readFileSync")
            .withArgs(keyStoreFilePath)
            .returns(
                await JSON.stringify(example)
            );

        eth2Keystore = await Eth2Keystore.create(keyStoreFilePath, password, keypair);
        eth2Keystore.decrypt(password);
        expect(writeStub.calledOnce).toEqual(true);
        expect(readStub.calledOnce).toEqual(true);

    });


    it("should decrypt", async () => {
        const keypair = await eth2Keystore.decrypt(password);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    });
    
    it("should fail on decrypt with wrong password", async () => {
        await expect(eth2Keystore.decrypt("wrongPassword"))
            .rejects
            .toThrow("Invalid password");
    });

    it("should get private key with changed password", async () => {
        await eth2Keystore.changePassword(password, newPassword);
        const keypair = await eth2Keystore.decrypt(newPassword);
        expect(keypair.privateKey.toHexString()).toEqual(privateKeyStr);
    }, 10000);

    it("should fail to encrypt private key with old password", async () => {
        await eth2Keystore.changePassword(newPassword, password);
        await expect(eth2Keystore.decrypt("oldPassword"))
            .rejects
            .toThrow("Invalid password");
    }, 10000);

    it("should destroy file", () => {
        const unlinkStub = sandbox
            .stub(fs, "unlinkSync")
            .withArgs(keyStoreFilePath)
            .returns();
        eth2Keystore.destroy();
        expect(unlinkStub.calledOnce).toEqual(true);
    });
});
