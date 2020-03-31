import {networks} from "../../../../../../src/renderer/services/deposit/networks";
import {SupportedNetworks} from "../../../../../../src/renderer/services/docker/chain";
import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {
    LighthouseBeaconApiClient,
    LighthouseBeaconRoutes
} from "../../../../../../src/renderer/services/eth2/client/lighthouse/beacon";

const httpMock = new MockAxiosAdapter(axios);

describe("ligthhouse beacon client", function() {

    const client = new LighthouseBeaconApiClient({
        config: networks.find((network) => network.networkName === SupportedNetworks.PRYSM)!.eth2Config,
        urlPrefix: ""
    });
    
    it("get client version", async function() {
        httpMock.onGet(LighthouseBeaconRoutes.VERSION).reply(200, "Lighthouse/v0.1.0-unstable/x86_64-linux");
        const version = await client.getClientVersion();
        expect(version.toString()).toContain("Lighthouse");
    });

    it("get fork", async function() {
        jest.spyOn(Date, "now").mockImplementation(() => Date.UTC(2020, 1, 1, 0, 0, 0));
        httpMock.onGet(LighthouseBeaconRoutes.FORK).reply(200, {
            "previous_version": "0x00000000",
            "current_version": "0x00000000",
            "epoch": 2
        });
        const fork = await client.getFork();
        expect(fork.fork.currentVersion).toEqual(Buffer.alloc(4, 0));
        expect(fork.fork.currentVersion).toEqual(Buffer.alloc(4, 0));
        expect(fork.fork.epoch).toEqual(2);
    });

    it("get genesis time", async function() {
        httpMock.onGet(LighthouseBeaconRoutes.GENESIS_TIME).reply(200, 1585412365);
        const genesis = await client.getGenesisTime();
        expect(genesis).toEqual(1585412365);
    });

    it("get sync status", async function() {
        const isSyncing = await client.getSyncingStatus();
        expect(isSyncing).toBeFalsy();
    });
    
});