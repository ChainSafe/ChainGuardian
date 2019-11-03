/* eslint-disable */
import {BeaconAPIClient} from "../../../../src/renderer/services/api/BeaconAPIClient";
import axios from "axios";
import {
    FETCH_GENESIS_TIME,
    FETCH_NODE_VERSION,
} from "../../../../src/renderer/constants/apiUrls";
import axiosMockAdapter from "axios-mock-adapter";
import {DEFAULT_HOSTNAME, DEFAULT_PORT} from "../../../../src/renderer/constants/defaultConstants";
import { CGDatabase } from "../../../../src/renderer/services/db/api";
import { LevelDbController } from "../../../../src/renderer/services/db";
// @ts-ignore
import level from "level";
import {promisify} from "util";
import leveldown, { LevelDown } from "leveldown";
import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import { initDB, getDB } from "../../../../src/renderer/services/db/api/database";

jest.setTimeout(10000);

const destoryLvlDb = (location: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        leveldown.destroy(location, (err) => {
            if(err){
                reject();
            }
            resolve();
        })
    })
}

// This sets the mock adapter on the default instance
const mock: axiosMockAdapter = new axiosMockAdapter(axios);
const API_URL = `https://${process.env.HOSTNAME || DEFAULT_HOSTNAME}:${process.env.PORT || DEFAULT_PORT}`;

/**
 * *******************
 * Mock axios requests
 * *******************
 */

mock.onGet(FETCH_NODE_VERSION).reply(200, "1");
mock.onGet(FETCH_GENESIS_TIME).reply(200, 2);


describe("Http Metrics", () => {
    let client: BeaconAPIClient;

    let database: CGDatabase, controller;

    const dbLocation = "./.__testdb";
    const testDb = level(dbLocation, {
        keyEncoding: "binary",
        valueEncoding: "binary"
    });
    const db = new LevelDbController({db: testDb, name: dbLocation});
    const testId = "id";

    beforeAll(async () => {
        await db.start();
    });

    afterAll(async () => {
        await db.stop();
        await destoryLvlDb(dbLocation);
    });

    beforeEach(() => {
        controller = db;
        initDB({controller, config});
        database = getDB();

        client = new BeaconAPIClient({
            urlPrefix: API_URL
        });
    });

    it("should return node version", async () => {
        await client.fetchNodeVersion();
        const metricsRecorded = await database.httpMetrics.getAll();
        expect(metricsRecorded.length).toBe(1);
        expect(metricsRecorded[0].method).toBe("fetchNodeVersion");
    });

    it("should return genesis time", async () => {
        await client.fetchGenesisTime();
        const metricsRecorded = await database.httpMetrics.getAll();
        expect(metricsRecorded.length).toBe(2);
        expect(metricsRecorded[1].method).toBe("fetchGenesisTime");
    });

});
