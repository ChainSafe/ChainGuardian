import {CGDatabase} from "../../renderer/services/db/api";
import {LevelDbController} from "../../renderer/services/db/controller";
import {config} from "@chainsafe/eth2.0-config/lib/presets/minimal";
import {IService} from "../../renderer/services/interfaces";
import {CGAccount} from "../../renderer/models/account";
import {getConfig} from "../config/config";
import {App} from "electron";

export class DatabaseHandler implements IService {
    // @ts-ignore
    private database: CGDatabase;

    public constructor() {
        try {
            this.database = new CGDatabase({
                config,
                controller: new LevelDbController({
                    name: getConfig().db.name
                })
            });
        } catch (e) {
            console.log(e);
        }

    }

    public async start(): Promise<void> {
        await this.database.start();
    }

    public async stop(): Promise<void> {
        await this.database.stop();
    }

    public saveToDatabase(id: string, input: any): void {
        this.database.account.set(id, input);
    }

    public async getFromDatabase(id: string): Promise<CGAccount | null> {
        return await this.database.account.get(id);
    }
}
