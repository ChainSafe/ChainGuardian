// @ts-ignore
import level from "level";
import {LevelDbController} from "../../../../src/main/db/controller";
import * as rimraf from "rimraf";

const dbLocation = "./.__testdb";

export const getLevelDbController = (): LevelDbController => {
    const testDb = level(dbLocation, {
        keyEncoding: "binary",
        valueEncoding: "binary",
    });
    return new LevelDbController({db: testDb, location: dbLocation});
};

export const destroyDb = async (): Promise<void> => {
    try {
        rimraf.sync(dbLocation);
        console.log("Database successfully destroyed.");
    } catch (e) {
        console.log(e);
        console.log("Database destroyed already.");
    }
};
