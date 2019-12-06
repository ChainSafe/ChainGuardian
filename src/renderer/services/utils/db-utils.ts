import {ipcRenderer} from 'electron'
import { SAVE_TO_DATABASE_REQUEST, GET_FROM_DATABASE_REQUEST } from '../../constants/keystore'
import { IIpcDatabaseEntry } from '../interfaces'

export function saveToDatabase(input: IIpcDatabaseEntry) {
    return ipcRenderer.sendSync(SAVE_TO_DATABASE_REQUEST, input)
}

export function getFromDatabase(id: string) {
    return ipcRenderer.sendSync(GET_FROM_DATABASE_REQUEST, id)
}