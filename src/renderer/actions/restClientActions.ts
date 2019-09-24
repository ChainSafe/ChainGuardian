import axios from 'axios';
import { FETCH_NODE_VERSION } from '../constants/apiUrls';
import { Action, ActionCreator } from 'redux';

export const SET_NODE_VERSION = 'SET_NODE_VERSION';

export interface SetNodeVersionAction extends Action {
    type: typeof SET_NODE_VERSION;
    version: string;
}

export const fetchNodeVersion = () => {
    return (dispatch: Function) => {
        fetchFromApi(FETCH_NODE_VERSION, (err: any, res: String) => {
            if (!err) {
                dispatch(setNodeVersion(res));
            }
        });
    };
};

export const setNodeVersion: ActionCreator<SetNodeVersionAction> = (version: string) => ({
    version,
    type: SET_NODE_VERSION
});

const postToApi = (url: string, data: any = {}, callback: Function) => {
    axios
        .post(url, data)
        .then(response => {
            callback(null, response);
        })
        .catch(err => {
            callback(err, null);
        });
};

const fetchFromApi = (url: string, callback: Function) => {
    // TODO call real API
    callback(null, '1');
    /*
    axios.get(url)
        .then(response => {
            callback(null, response)
        }).catch(err => {
            callback(err, null)
        })
    */
};

export type RestClientAction = SetNodeVersionAction;
