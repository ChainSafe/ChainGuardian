import {Application} from "spectron";
import path from "path";
import {Routes} from "../../src/renderer/constants/routes";
import {existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync} from "fs";

export const TIMEOUT = 120000;

let dbLocation = "";

export async function setApp(url: Routes = Routes.LOGIN_ROUTE): Promise<Application> {
    const isWin = process.platform === "win32";
    let electronPath =  path.join(__dirname, "../../node_modules/.bin/electron");
    if(isWin) {
        electronPath += ".cmd";
    }
    dbLocation = path.join(__dirname, "./test-screens.db");
    try {
        deleteFolderRecursive(dbLocation);
    } catch (e) {
        console.warn(e);
    }
    const app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "..", "../dist/main.js")],
        waitTimeout: 15000,
        quitTimeout: 4000,
        // chromeDriverLogPath: path.join(__dirname, "chrome.log"),
        connectionRetryCount: 3,
        env: {NODE_ENV: "test", IS_TESTING: true, CG_DATABASE_LOCATION: dbLocation, CG_INITIAL_ROUTE: url},
    });


    try {
        // await initBLS();
        await app.start();
    } catch (e) {
        console.warn(e);
        await app.start();
    }
    await app.client.waitUntilWindowLoaded();
    return app;
}

export async function stopApp(app: Application): Promise<void> {
    if (app && app.isRunning()) {
        try {
            await app.stop();
        } catch (e) {
            app.mainProcess.exit(0);
            app.rendererProcess.exit(0);
        }
    }
    try {
        deleteFolderRecursive(dbLocation);
    } catch (e) {
        console.warn(e);
    }
}

function deleteFolderRecursive(path: string): void {
    if (existsSync(path)) {
        readdirSync(path).forEach(function (file) {
            const curPath = path + "/" + file;
            if (lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                unlinkSync(curPath);
            }
        });
        rmdirSync(path);
    }
}
