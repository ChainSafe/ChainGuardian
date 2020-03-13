import {BLSPubkey} from "@chainsafe/eth2.0-types";
import {ValidatorDB} from "../../../../../src/renderer/services/db/api/validator";
import {initBLS, PrivateKey} from "@chainsafe/bls";
import {generateAttestation} from "../../../mocks/attestation";
import {CGDatabase} from "../../../../../src/renderer/services/db/api";
import {generateEmptySignedBlock} from "../../../mocks/block";
import {destroyDb, getLevelDbController} from "../utils";
import {LevelDbController} from "../../../../../src/main/db/controller";
// import {equals} from "@chainsafe/ssz";
// import {types as mainnetTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/mainnet";

describe("IValidatorDB Implementation Test", () => {
    let database: CGDatabase;
    let validatorDB: ValidatorDB;
    let controller: LevelDbController;

    beforeAll(async () => {
        await initBLS();
        controller = getLevelDbController();
        await controller.start();
    });

    afterAll(async () => {
        await controller.stop();
        await destroyDb();
    });

    beforeEach(async() => {
        database = new CGDatabase({controller});
        validatorDB = new ValidatorDB(database);
    });


    it("should save and load validator attestation", async () => {
        const validators = [
            PrivateKey.random().toPublicKey().toBytesCompressed(),
            PrivateKey.random().toPublicKey().toBytesCompressed()
        ];
        let result = await validatorDB.getAttestations(validators[0]);
        expect(result.length).toEqual(0);

        const mockAttestation = generateAttestation();
        await validatorDB.setAttestation(validators[0], mockAttestation);

        result = await validatorDB.getAttestations(validators[0]);
        expect(result.length).toEqual(1);
        // expect(equals(mainnetTypes.Attestation, result[0], mockAttestation)).toEqual(true);
    });

    it("should save and load multiple validators attestation", async () => {
        const validators = [
            PrivateKey.random().toPublicKey().toBytesCompressed(),
            PrivateKey.random().toPublicKey().toBytesCompressed()
        ];
        let result = await validatorDB.getAttestations(validators[0]);
        expect(result.length).toEqual(0);

        const mockAttestation = generateAttestation();
        mockAttestation.signature = Buffer.alloc(96).fill("ab");
        const mockAttestation2 = generateAttestation();
        mockAttestation2.signature = Buffer.alloc(96).fill("2");
        await validatorDB.setAttestation(validators[0], mockAttestation);
        await validatorDB.setAttestation(validators[1], generateAttestation());
        await validatorDB.setAttestation(validators[0], mockAttestation2);

        result = await validatorDB.getAttestations(validators[0]);
        expect(result.length).toEqual(2);
        // expect(result).toEqual(mockAttestation);
        // expect(result[1]).toEqual(mockAttestation2);
    });

    it("should delete attestations", async () => {
        const validators = [
            PrivateKey.random().toPublicKey().toBytesCompressed(),
            PrivateKey.random().toPublicKey().toBytesCompressed()
        ];
        let result = await validatorDB.getAttestations(validators[0]);
        expect(result.length).toEqual(0);

        const mockAttestation = generateAttestation();
        mockAttestation.signature = Buffer.alloc(96).fill("cc");
        const mockAttestation2 = generateAttestation();
        mockAttestation2.signature = Buffer.alloc(96).fill("3");
        await validatorDB.setAttestation(validators[0], mockAttestation);
        await validatorDB.setAttestation(validators[1], generateAttestation());
        await validatorDB.setAttestation(validators[0], mockAttestation2);

        await validatorDB.deleteAttestations(validators[0], [mockAttestation, mockAttestation2]);
        result = await validatorDB.getAttestations(validators[0]);
        expect(result.length).toEqual(0);
        result = await validatorDB.getAttestations(validators[1]);
        expect(result.length).toEqual(1);
    });

    const fillAttestations = async(): Promise<BLSPubkey[]> => {
        const validators = [
            PrivateKey.random().toPublicKey().toBytesCompressed(),
            PrivateKey.random().toPublicKey().toBytesCompressed()
        ];
        const result = await validatorDB.getAttestations(validators[0]);
        expect(result.length).toEqual(0);

        const mockAttestation = generateAttestation();
        mockAttestation.data.target.epoch = 3;
        mockAttestation.signature = Buffer.alloc(96).fill("dd");
        const mockAttestation2 = generateAttestation();
        mockAttestation2.signature = Buffer.alloc(96).fill("4");
        mockAttestation2.data.target.epoch = 6;
        await validatorDB.setAttestation(validators[0], mockAttestation);
        await validatorDB.setAttestation(validators[1], generateAttestation());
        await validatorDB.setAttestation(validators[0], mockAttestation2);

        return validators;
    };

    it("should fetch attestations with epoch options within range", async () => {
        const validators = await fillAttestations();
        const result = await validatorDB.getAttestations(validators[0], {
            gt: 2,
            lt: 6
        });
        expect(result.length).toEqual(1);
        // expect(result[0]).toEqual(mockAttestation);
    });

    it("should fetch no attestations with epoch options outside range", async () => {
        const validators = await fillAttestations();

        const result = await validatorDB.getAttestations(validators[0], {
            gt: 3,
            lt: 6
        });
        expect(result.length).toEqual(0);
    });

    it("should save and load saved block", async () => {
        const validator = PrivateKey.random().toPublicKey().toBytesCompressed();
        let result = await validatorDB.getBlock(validator);
        expect(result).toEqual(null);

        const mockBlock = generateEmptySignedBlock();
        await validatorDB.setBlock(validator, mockBlock);

        result = await validatorDB.getBlock(validator);
        expect(result).not.toBeNull();
        // expect(result).toEqual(mockBlock);
    });
});
