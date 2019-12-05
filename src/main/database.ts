import { CGDatabase } from "../renderer/services/db/api";
// @ts-ignore
import { LevelDbController } from '../renderer/services/db/controller';
import { config } from '@chainsafe/eth2.0-config/lib/presets/minimal';
import { IService } from "../renderer/services/interfaces";

export class DatabaseHandler implements IService{
    private database: CGDatabase;

    constructor() {
        this.database = new CGDatabase({config, controller: new LevelDbController({name: "test-level.db"})});
    }

    public async start() {
       await this.database.start();
    }

    public async stop() {
        await this.database.stop();
    }
    
    // FIXME  maybe AWAIT!
    public async saveToDatabase(id: string, input: any){
        return this.database.account.set(id, input);
    }
    
    public getFromDatabase(id: string): any{
       return this.database.account.get(id);
    }
}
