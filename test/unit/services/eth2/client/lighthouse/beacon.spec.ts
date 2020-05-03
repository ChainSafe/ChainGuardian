import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {LighthouseBeaconApiClient} from "../../../../../../src/renderer/services/eth2/client/lighthouse/beacon";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {LighthouseRoutes} from "../../../../../../src/renderer/services/eth2/client/lighthouse/routes";
import * as fs from "fs";
import * as path from "path";
import {SyncingStatus} from "@chainsafe/lodestar-types";
import {parse} from "json-bigint";

const httpMock = new MockAxiosAdapter(axios);

describe("ligthhouse beacon client", function() {

    const client = new LighthouseBeaconApiClient({
        config,
        baseUrl: ""
    });
    
    it("get chain head", async function() {
        httpMock.onGet(LighthouseRoutes.GET_HEAD).reply(
            200,
            JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/beacon/head.json"), "utf-8"))
        );
        const head = await client.getChainHead();
        expect(head).toBeDefined();
        expect(head.slot).toEqual(37923);
        expect(
            config.types.Root.equals(
                head.blockRoot,
                Buffer.from("e865d4805395a0776b8abe46d714a9e64914ab8dc5ff66624e5a1776bcc1684b", "hex")
            )
        ).toBeTruthy();
    });

    it("get client version", async function() {
        httpMock.onGet(LighthouseRoutes.GET_VERSION).reply(200, "Lighthouse/v0.1.0-unstable/x86_64-linux");
        const version = await client.getClientVersion();
        expect(version.toString()).toContain("Lighthouse");
    });

    it("get fork", async function() {
        httpMock.onGet(LighthouseRoutes.GET_FORK).reply(200, {
            "previous_version": "0x00000000",
            "current_version": "0x00000000",
            "epoch": 2
        });
        httpMock.onGet(LighthouseRoutes.GET_GENESIS_VALIDATORS_ROOT)
            .reply(200, config.types.Root.toJson(Buffer.alloc(32, 3)));
        const fork = await client.getFork();
        expect(Buffer.from(fork.fork.currentVersion.valueOf() as Uint8Array)).toEqual(Buffer.alloc(4, 0));
        expect(Buffer.from(fork.fork.currentVersion.valueOf() as Uint8Array)).toEqual(Buffer.alloc(4, 0));
        expect(fork.fork.epoch).toEqual(2);
        expect(Buffer.from(fork.genesisValidatorsRoot.valueOf() as Uint8Array)).toEqual(Buffer.alloc(32, 3));
    });

    it("get genesis time", async function() {
        httpMock.onGet(LighthouseRoutes.GET_GENESIS_TIME).reply(200, 1585412365);
        const genesis = await client.getGenesisTime();
        expect(genesis).toEqual(1585412365);
    });

    it("get sync status - synced", async function() {
        httpMock
            .onGet(LighthouseRoutes.GET_SYNC_STATUS)
            .reply(
                200,
                JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/beacon/sync/synced.json"), "utf-8"))
            );
        const isSyncing = await client.getSyncingStatus();
        expect(isSyncing).toBeFalsy();
    });

    it("get sync status - sync finalized", async function() {
        httpMock
            .onGet(LighthouseRoutes.GET_SYNC_STATUS)
            .reply(
                200,
                JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/beacon/sync/finalized.json"), "utf-8"))
            );
        const syncStatus = await client.getSyncingStatus() as SyncingStatus;
        expect(syncStatus.currentBlock.toString()).toEqual("20");
        expect(syncStatus.startingBlock.toString()).toEqual("10");
        expect(syncStatus.highestBlock.toString()).toEqual("20");
    });

    it("get sync status - sync head", async function() {
        httpMock
            .onGet(LighthouseRoutes.GET_SYNC_STATUS)
            .reply(
                200,
                JSON.parse(fs.readFileSync(path.join(__dirname, "./payloads/beacon/sync/head.json"), "utf-8"))
            );
        const syncStatus = await client.getSyncingStatus() as SyncingStatus;
        expect(syncStatus.currentBlock.toString()).toEqual("1195");
        expect(syncStatus.startingBlock.toString()).toEqual("0");
        expect(syncStatus.highestBlock.toString()).toEqual("1195");
    });
    
    it("get validator - exists", async function() {
        httpMock.onPost(
            LighthouseRoutes.GET_VALIDATORS
        )
            .reply(
                200,
                parse(fs.readFileSync(path.join(__dirname, "./payloads/beacon/validators.json"), "utf-8"))
            );
        const validator = await client.getValidator(
            Buffer.from(
                "98f87bc7c8fa10408425bbeeeb3dc387e3e0b4bd92f57775b60b39156a16f9ec80b273a64269332d97bdb7d93ae05a16",
                "hex")
        );
        expect(validator).toBeDefined();
        expect(validator.index).toEqual(14935);
        expect(validator.balance.toString()).toEqual("3228885987");
        expect(validator.validator).toBeDefined();
    });

    it("get validator - doesn't exists", async function() {
        httpMock.onPost(
            LighthouseRoutes.GET_VALIDATORS
        )
            .reply(
                200,
                parse(fs.readFileSync(path.join(__dirname, "./payloads/beacon/validators.json"), "utf-8"))
            );
        const validator = await client.getValidator(
            Buffer.from(
                "42f87bc7c8fa10408425bbeeeb3dc3874242b4bd92f57775b60b39142426f9ec80b273a64269332d97bdb7d93ae05a42",
                "hex")
        );
        expect(validator).toBeNull();
    });
    
});