import {Application} from "spectron";
import path from "path";

export function setApp(): Application{
    const isWin = process.platform === "win32";
    let electronPath =  path.join(__dirname, "../../node_modules/.bin/electron");
    if(isWin) {
        electronPath += ".cmd";
    }
    const app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "..", "..")],
        waitTimeout: 15000,
        startTimeout: 15000,
    });
    return app;
}