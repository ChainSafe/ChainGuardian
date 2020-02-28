import {PrysmBeaconApiClient, PrysmBeaconRoutes} from "../../../../../src/renderer/services/eth2/client/prysm/beacon";
import {networks} from "../../../../../src/renderer/services/deposit/networks";
import {SupportedNetworks} from "../../../../../src/renderer/services/docker/chain";
import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {base64Encode, fromHex} from "../../../../../src/renderer/services/utils/bytes";

const httpMock = new MockAxiosAdapter(axios);

describe("prysm beacon client", function() {

    const client = new PrysmBeaconApiClient({
        config: networks.find((network) => network.networkName === SupportedNetworks.PRYSM)!.eth2Config,
        urlPrefix: ""
    });
    
    it("get client version", async function() {
        httpMock.onGet(PrysmBeaconRoutes.VERSION).reply(200, {
            version: "Prysm/Git commit: 0e37b4926a83d1ba81bc87b7be52ed627504e398. Built at: 2020-02-18 05:59:05+00:00",
            metadata: ""
        });
        const version = await client.getClientVersion();
        expect(version.toString("ascii")).toContain("Prysm");
    });

    it("get fork", async function() {
        jest.spyOn(Date, "now").mockImplementation(() => Date.UTC(2020, 1, 1, 0, 0, 0));
        httpMock.onGet(PrysmBeaconRoutes.DOMAIN, {epoch: 0, domain: base64Encode(fromHex("00000000"))}).reply(200, {
            signatureDomain: base64Encode(fromHex("0000000000000004")),
        });

        httpMock.onGet(PrysmBeaconRoutes.GENESIS).reply(200, {
            depositContractAddress: "RomjxjziSTVcilc7WXTbIdLRuO8=",
            //GMT
            genesisTime: "2020-02-01T00:00:00Z"
        });
        const fork = await client.getFork();
        expect(fork.fork.currentVersion).toEqual(fork.fork.previousVersion);
        expect(fork.fork.currentVersion).toEqual(fromHex("00000004"));
        expect(fork.fork.epoch).toEqual(0);
    });

    it("get genesis time", async function() {
        httpMock.onGet(PrysmBeaconRoutes.GENESIS).reply(200, {
            depositContractAddress: "RomjxjziSTVcilc7WXTbIdLRuO8=",
            //GMT
            genesisTime: "2020-02-01T00:00:00Z"
        });
        const genesis = await client.getGenesisTime();
        expect(genesis).toEqual(Date.UTC(2020, 1, 1) / 1000);
    });

    it("get sync status", async function() {
        httpMock.onGet(PrysmBeaconRoutes.SYNCING).reply(200, {
            syncing: true
        });
        const isSyncing = await client.getSyncingStatus();
        expect(isSyncing).toBeTruthy();
    });
    
});