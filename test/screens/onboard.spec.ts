import path from "path";
import {Application} from "spectron";

describe("Main window", () => {
    let app: Application;

    beforeEach(async () => {
        try {
            const isWin = process.platform === "win32";
            let electronPath =  path.join(__dirname, "../../node_modules/.bin/electron");
            if(isWin) {
                electronPath += ".cmd";
            }
            app = new Application({
                path: electronPath,
                args: [path.join(__dirname, "..", "..")],
                waitTimeout: 15000,
                startTimeout: 15000,
            });
            await app.start();
        } catch (e) {
            console.log(e);
        }
    });

    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it('should work', () => {
        expect(true).toBe(true)
    });

})