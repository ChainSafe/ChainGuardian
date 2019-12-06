import {ipcRenderer} from 'electron'
import { SAVE_TO_DATABASE_REQUEST } from '../../../main/main'

export function saveToDatabase(input: any) {
    console.log(input)
    console.log(ipcRenderer)
    return ipcRenderer.sendSync('a', input)
}