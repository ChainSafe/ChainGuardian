import {IChainForkConfig} from "@chainsafe/lodestar-config";
import {CGAccount} from "../models/account";
import {ethers} from "ethers";
import {IDockerRunParams} from "./docker/type";

export interface IService {
    start(): Promise<void>;

    stop(): Promise<void>;
}

/********************
 * Keystore interfaces
 * *******************/
interface IPBKDFParamsOut {
    c: number;
    dklen: number;
    prf: string;
    salt: string;
}
interface IScryptKDFParamsOut {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: string;
}

type KDFParamsOut = IScryptKDFParamsOut | IPBKDFParamsOut;

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
export interface IV3Keystore {
    crypto: {
        cipher: string;
        cipherparams: {
            iv: string;
        };
        ciphertext: string;
        kdf: string;
        kdfparams: KDFParamsOut;
        mac: string;
    };
    id: string;
    version: number;
    address: string;
}
/************************/

export interface INetworkConfig {
    eth2Config: IChainForkConfig;
    genesisTime: number;
    networkId: number;
    networkName: string;
    eth1Provider: ethers.providers.BaseProvider;
    contract: {
        address: string;
        bytecode: string;
        depositAmount: string | number;
        deployedAtBlock: number;
    };
    dockerConfig: IDockerRunParams;
}

export interface IIpcDatabaseEntry {
    id: string;
    account: CGAccount;
}
