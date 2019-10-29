import {Application} from "spectron";
import path from "path";
import {Routes} from "../../src/renderer/constants/routes";

const TIMEOUT = 15000;

export async function setApp(url: Routes = Routes.LOGIN_ROUTE): Promise<Application> {
    const isWin = process.platform === "win32";
    let electronPath =  path.join(__dirname, "../../node_modules/.bin/electron");
    if(isWin) {
        electronPath += ".cmd";
    }
    
    const app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "..", "..")],
        waitTimeout: TIMEOUT,
        startTimeout: TIMEOUT
    });

    await app.start();

    const currentUrl = await app.client.getUrl();

    await app.browserWindow.loadURL(currentUrl.split("#")[0] + "#" + url);

    return app;
}