/**
 * Params for calling deposit contract on eth1
 */
export interface ITx {
    to: string;
    value: string;
    data: string | Buffer;
}
