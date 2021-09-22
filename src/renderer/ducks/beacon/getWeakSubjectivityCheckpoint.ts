import {WeakSubjectivityCheckpoint} from "../../components/ConfigureBeaconNode/ConfigureBeaconNode";
import {call, CallEffect} from "redux-saga/effects";
import {getNetworkConfig} from "../../services/eth2/networks";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {HttpClient} from "../../services/api";
import cheerio from "cheerio";
import {CgEth2ApiClient} from "../../services/eth2/client/module";

export type BeaconScanWSC = {
    // eslint-disable-next-line camelcase
    current_epoch: number;
    // eslint-disable-next-line camelcase
    is_safe: boolean;
    // eslint-disable-next-line camelcase
    ws_checkpoint: string;
    // eslint-disable-next-line camelcase
    ws_period: number;
};

export function* getWeakSubjectivityCheckpoint(
    type: WeakSubjectivityCheckpoint,
    meta: string,
    network: string,
    // eslint-disable-next-line camelcase
): Generator<CallEffect | Promise<string>, string, BeaconScanWSC & string & {current_finalized_epoch: number}> {
    if (type !== WeakSubjectivityCheckpoint.none) {
        if (type === WeakSubjectivityCheckpoint.custom) return meta;
        if (type === WeakSubjectivityCheckpoint.infura) {
            const config = getNetworkConfig(network);
            const api = new CgEth2ApiClient((config as unknown) as IBeaconConfig, meta);
            return yield call(api.beacon.state.getWeakSubjectivityCheckpoint);
        }
        if (type === WeakSubjectivityCheckpoint.beaconScan) {
            const httpClient = new HttpClient(`https://beaconscan.com/`);
            if (network === "mainnet") {
                const ws = yield httpClient.get(`ws_checkpoint`, {timeout: 10000});
                if (ws) return ws.ws_checkpoint;
            }

            // TODO: change scraper with api after etherscan implement it
            const dom = yield call(httpClient.get, network);
            const home = cheerio.load(dom);
            const href = home("#finalizedSlot a")[0].attribs["href"];
            const domSlot = yield call(httpClient.get, href);
            const slot = cheerio.load(domSlot);
            const root = slot("#ContentPlaceHolder1_divDetail > div:nth-child(2) > div.col-md-9.font-size-1").text();
            const epoch = slot(
                "#overview > div > div > div:nth-child(2) > div.col-md-9.js-focus-state.font-size-1 > a",
            ).text();

            console.warn(root, epoch);
            return `${root.replace(/(\r\n|\n|\r)/gm, "")}:${epoch.replace(/(\r\n|\n|\r)/gm, "")}`;
        }
        if (type === WeakSubjectivityCheckpoint.beaconChain) {
            // TODO: change scraper with api after beaconcha.in implement it
            const httpClient = new HttpClient(`https://${network !== "mainnet" ? network + "." : ""}beaconcha.in/`);
            const result = yield call(httpClient.get, "/index/data");
            const dom = yield call(httpClient.get, `/epoch/${result.current_finalized_epoch}`);
            const home = cheerio.load(dom);
            const roots: string[] = [];
            home("tbody i").each((_, el) => {
                roots.push(el.attribs["data-clipboard-text"]);
            });
            return `${roots.reverse()[0]}:${result.current_finalized_epoch}`;
        }
    }
    return "";
}
