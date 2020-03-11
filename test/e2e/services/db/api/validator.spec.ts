import {ValidatorDB} from "../../../../../src/renderer/services/db/api/validator";
import {initBLS, PrivateKey} from "@chainsafe/bls";
import {generateAttestation} from "../../../mocks/attestation";
import {CGDatabase} from "../../../../../src/renderer/services/db/api";
import {destroyDb, getLevelDbController} from "../utils";
import {LevelDbController} from "../../../../../src/main/db/controller";
import {equals} from "@chainsafe/ssz";
import {types as mainnetTypes} from "@chainsafe/eth2.0-types/lib/ssz/presets/mainnet";

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
        expect(equals(mainnetTypes.Attestation, result[0], mockAttestation)).toEqual(true);
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
        expect(result).toEqual(mockAttestation);
        expect(result[1]).toEqual(mockAttestation2);
    });
});
