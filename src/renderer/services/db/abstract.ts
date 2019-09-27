import { object } from 'prop-types';

export interface CGSerialization<T> {
    serialize(value: any, type: T): Buffer;
    deserialize(value: Buffer, type: T): any;
    hashTreeRoot(value: any, type: T): Buffer;
}
