import {Application} from "spectron";
import path from "path";
import {Routes} from "../../src/renderer/constants/routes";

export const TIMEOUT = 120000;

export async function setApp(url: Routes = Routes.LOGIN_ROUTE): Promise<Application> {
    const isWin = process.platform === "win32";
    let electronPath =  path.join(__dirname, "../../node_modules/.bin/electron");
    if(isWin) {
        electronPath += ".cmd";
    }
    
    const app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "..", "..")],
        waitTimeout: 15000,
        quitTimeout: 4000,
        connectionRetryCount: 3,
        env: {NODE_ENV: "test"},
        startTimeout: 30000
    });
    try {
        await app.start();
    } catch (e) {
        await app.restart();
    }

    const currentUrl = await app.client.getUrl();
    await app.browserWindow.loadURL(currentUrl.split("#")[0] + "#" + url);

    await app.client.waitUntilWindowLoaded();
    return app;
}

export async function stopApp(app: Application): Promise<void> {
    if (app && app.isRunning()) {
        try {
            await app.stop();
        } catch (e) {
            console.log(e);
            app.mainProcess.exit(0);
            app.rendererProcess.exit(0);
        }
    }
}