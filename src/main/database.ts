import { CGDatabase } from "../renderer/services/db/api";
import { LevelDbController } from "../renderer/services/db/controller";
import { config } from "@chainsafe/eth2.0-config/lib/presets/minimal";
import { IService } from "../renderer/services/interfaces";
import { CGAccount } from "../renderer/models/account";
import fs from 'fs'

export class DatabaseHandler implements IService {
  private database: CGDatabase;
  private databasePath: string;

  public constructor() {
    const random = Math.floor(100000 + Math.random() * 900000)
    this.databasePath = `test-level-${random}.db`
    this.database = new CGDatabase({ config, controller: new LevelDbController({ name: this.databasePath }) });
  }

  public async start(): Promise<void> {
    await this.database.start();
    //ipcMain.on(DATABASE_SAVE_EVENT, this.handleSaveEvent)
  }

  public async stop(): Promise<void> {
    deleteFolderRecursive(this.databasePath)
    await this.database.stop();
    //ipcMain.removeListener(DATABASE_SAVE_EVENT, this.handleSaveEvent)
  }

  public saveToDatabase(id: string, input: any): void {
    this.database.account.set(id, input);
  }

  public async getFromDatabase(id: string): Promise<CGAccount | null> {
    const account = await this.database.account.get(id);
    return account;
  }
}

var deleteFolderRecursive = function (path: string) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};