import {Application} from "spectron";
import path from "path";

const TIMEOUT = 15000;
const MINIMUM_PORT = 4444;
const MAXIMUM_PORT = 5555;


export function setApp(): Application{
    const isWin = process.platform === "win32";
    let electronPath =  path.join(__dirname, "../../node_modules/.bin/electron");
    if(isWin) {
        electronPath += ".cmd";
    }

    const randomPort = Math.floor(Math.random() * (MAXIMUM_PORT - MINIMUM_PORT + 1)) + MINIMUM_PORT;
    
    const app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "..", "..")],
        waitTimeout: TIMEOUT,
        startTimeout: TIMEOUT,
        port: randomPort
    });
    return app;
}