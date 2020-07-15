import axios from "axios";
import MockAxiosAdapter from "@nodefactory/axios-mock-adapter";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {LighthouseRoutes} from "../../../../../../src/renderer/services/eth2/client/lighthouse/routes";
import * as fs from "fs";
import * as path from "path";
import {WinstonLogger} from "@chainsafe/lodestar-utils";
import sinon from "sinon";
import {LighthouseNodeApiClient} from "../../../../../../src/renderer/services/eth2/client/lighthouse/node";

const httpMock = new MockAxiosAdapter(axios);

describe("ligthhouse node client", function() {

    const client = new LighthouseNodeApiClient({
        config,
        logger: sinon.createStubInstance(WinstonLogger),
        baseUrl: ""
    });

    it("get version", async function() {
        httpMock.onGet(LighthouseRoutes.GET_VERSION).reply(
            200,
            "Lighthouse"
        );
        const head = await client.getVersion();
        expect(head).toBe("Lighthouse");
    });

    it("get sync status - synced", async function() {
        httpMock.onGet(LighthouseRoutes.GET_SYNC_STATUS).reply(200,
            fs.readFileSync(path.join(__dirname, "./payloads/node/sync_status_synced.json"), "utf-8")
        );
        const status = await client.getSyncingStatus();
        expect(status.syncDistance.toString()).toEqual("0");
        expect(status.headSlot.toString()).toEqual("200");
    });

    it("get sync status - syncing", async function() {
        httpMock.onGet(LighthouseRoutes.GET_SYNC_STATUS).reply(200,
            fs.readFileSync(path.join(__dirname, "./payloads/node/sync_status_syncing.json"), "utf-8")
        );
        const status = await client.getSyncingStatus();
        expect(status.syncDistance.toString()).toEqual("100");
        expect(status.headSlot.toString()).toEqual("200");
    });

});
