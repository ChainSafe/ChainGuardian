import {CGDatabase} from "../../renderer/services/db/api";
import {LevelDbController} from "../../renderer/services/db/controller";
import {config} from "@chainsafe/eth2.0-config/lib/presets/minimal";
import {IService} from "../../renderer/services/interfaces";
import {CGAccount} from "../../renderer/models/account";
import {getConfig} from "../config/config";

export class DatabaseHandler implements IService {

    private database: CGDatabase;

    public constructor() {
        this.database = new CGDatabase({
            config,
            controller: new LevelDbController({
                location: getConfig().db.name
            })
        });
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
