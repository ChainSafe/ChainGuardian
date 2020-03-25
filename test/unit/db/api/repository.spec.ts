import sinon from "sinon";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {config} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {BulkRepository} from "../../../../src/renderer/services/db/api/repository";
import {SSZ} from "../../../../src/renderer/services/db/serializers/ssz";
import {IDatabaseController, LevelDbController} from "../../../../src/main/db/controller";
import {Bucket} from "../../../../src/renderer/services/db/schema";
import {ContainerType} from "@chainsafe/ssz";
import {Bytes32} from "@chainsafe/lodestar-types";

chai.use(chaiAsPromised);

const TestSSZType = new ContainerType<ITestType>({
    fields: {
        bool: config.types.Boolean,
        //@ts-ignore
        bytes: config.types.Bytes32
    }
});

interface ITestType {
    bool: boolean;
    bytes: Bytes32;
}

const BucketMock = "testBucket";

class TestRepository extends BulkRepository<ITestType> {
    public constructor(db: IDatabaseController) {
        super(db, SSZ, BucketMock as unknown as Bucket, TestSSZType);
    }
}

describe("database repository", () => {
    const sandbox = sinon.createSandbox();

    let repository: TestRepository;
    let controller: sinon.SinonStubbedInstance<LevelDbController>;

    beforeEach(() => {
        controller = sandbox.createStubInstance(LevelDbController);
        repository = new TestRepository(controller);
    });

    it("should get single item", async () => {
        const item = {bool: true, bytes: Buffer.alloc(32)};
        controller.get.resolves(SSZ.serialize(item, TestSSZType));
        const result = await repository.get("id");
        expect(result).to.be.deep.equal(item);
        expect(controller.get.calledOnce).to.be.true;
    });

    it("should return null if item not found", async () => {
        controller.get.resolves(null);
        const result = await repository.get("id");
        expect(result).to.be.deep.equal(null);
        expect(controller.get.calledOnce).to.be.true;
    });

    it("should return true if item exists", async () => {
        const item = {bool: true, bytes: Buffer.alloc(32)};
        controller.get.resolves(SSZ.serialize(item, TestSSZType));
        const result = await repository.has("id");
        expect(result).to.be.true;
        expect(controller.get.calledOnce).to.be.true;
    });

    it("should return false if item doesnt exists", async () => {
        controller.get.resolves(null);
        const result = await repository.has("id");
        expect(result).to.be.false;
        expect(controller.get.calledOnce).to.be.true;
    });

    it("should store with hashTreeRoot as id", async () => {
        const item = {bool: true, bytes: Buffer.alloc(32)};
        await expect(repository.setUnderRoot(item)).to.not.be.rejected;
        expect(controller.put.calledOnce).to.be.true;
    });

    it("should store with given id", async () => {
        const item = {bool: true, bytes: Buffer.alloc(32)};
        await expect(repository.set(1, item)).to.not.be.rejected;
        expect(controller.put.calledOnce).to.be.true;
    });

    it("should delete", async () => {
        await expect(repository.delete(1)).to.not.be.rejected;
        expect(controller.delete.calledOnce).to.be.true;
    });

    it("should return all items", async () => {
        const item = {bool: true, bytes: Buffer.alloc(32)};
        const itemSerialized = SSZ.serialize(item, TestSSZType);
        const items = [itemSerialized, itemSerialized, itemSerialized];
        controller.search.resolves(items);
        const result = await repository.getAll();
        expect(result).to.be.deep.equal([item, item, item]);
        expect(controller.search.calledOnce).to.be.true;
    });

    // it("should delete given items", async () => {
    //     await repository.deleteMany([1, 2, 3]);
    //     expect(controller.batchDelete.withArgs(
    //     sinon.match(criteria => criteria.length === 3)).calledOnce).to.be.true;
    // });
    //
    // it("should delete given items by value", async () => {
    //     const item = {bool: true, bytes: Buffer.alloc(32)};
    //     await repository.deleteManyByValue([item, item]);
    //     expect(controller.batchDelete.withArgs(
    //     sinon.match(criteria => criteria.length === 2)).calledOnce).to.be.true;
    // });
    //
    // it("should delete all items", async () => {
    //     const item = SSZ.serialize({bool: true, bytes: Buffer.alloc(32)}, TestSSZType);
    //     const items = [item, item];
    //     controller.search.resolves(items);
    //     await repository.deleteAll();
    //     expect(controller.batchDelete.withArgs(
    //     sinon.match(criteria => criteria.length === 2)).calledOnce).to.be.true;
    // });
});
