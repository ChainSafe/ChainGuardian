import {Application} from "spectron";
import path from "path";

const TIMEOUT = 15000;

export function setApp(): Application{
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
    return app;
}