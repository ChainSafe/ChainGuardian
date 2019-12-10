import {ipcRenderer} from "electron";
import {SAVE_TO_DATABASE_REQUEST, GET_FROM_DATABASE_REQUEST} from "../../constants/ipc";
import {IIpcDatabaseEntry} from "../interfaces";
import {CGAccount} from "../../models/account";

export function saveToDatabase(input: IIpcDatabaseEntry): Promise<boolean> {
    return ipcRenderer.sendSync(SAVE_TO_DATABASE_REQUEST, input);
}

export function getFromDatabase(id: string): Promise<CGAccount | null> {
    return ipcRenderer.sendSync(GET_FROM_DATABASE_REQUEST, id);
}