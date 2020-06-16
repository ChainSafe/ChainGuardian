import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {initBLS} from "@chainsafe/bls";
import sinon from "sinon";
import {initialState} from "./register.action.spec";
import {saveBeaconNodeAction} from "../../../../src/renderer/actions/network";
import database from "../../../../src/renderer/services/db/api/database";
import {IRegisterState} from "../../../../src/renderer/reducers/register";
import {BeaconChain} from "../../../../src/renderer/services/docker/chain";
import {BeaconNodes} from "../../../../src/renderer/models/beaconNode";

const signingKey = "0x3fbcae9c00fe0cacbe3b6676f282357196fc00a86acd4db61cf728d37052dc2c";

describe("register actions", () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const reduxStore = mockStore({
        ...initialState,
        register: {
            signingKey
        } as IRegisterState
    });

    beforeAll(async() => {
        await initBLS();
    });

    beforeEach(async() => {
        reduxStore.clearActions();
    });

    afterEach(async() => {
        sinon.restore();
    });

    it("should save beacon node to db with container name", async() => {
        const spy = sinon.stub(database.beaconNodes, "set").resolves();
        await reduxStore.dispatch<any>(saveBeaconNodeAction("localhost", "Prysm"));
        const address = PrivateKey.fromHexString(signingKey).toPublicKey().toHexString();
        const node = new BeaconNodes();
        node.addNode("localhost", BeaconChain.getContainerName("Prysm"));
        expect(spy.calledWith(address, node)).toEqual(true);
    });

    it("should save beacon node to db without container name", async() => {
        const spy = sinon.stub(database.beaconNodes, "set").resolves();
        await reduxStore.dispatch<any>(saveBeaconNodeAction("localhost"));
        const address = PrivateKey.fromHexString(signingKey).toPublicKey().toHexString();
        const node = new BeaconNodes();
        node.addNode("localhost", null);
        expect(spy.calledWith(address, node)).toEqual(true);
    });
});
