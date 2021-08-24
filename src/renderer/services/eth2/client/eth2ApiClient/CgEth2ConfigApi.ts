import {CgEth2Base} from "./CgEth2Base";
import {DepositContract, ISpec} from "@chainsafe/lodestar-api/lib/routes/config";
import {Json} from "@chainsafe/ssz";
import {ssz, phase0} from "@chainsafe/lodestar-types";
import {CgConfigApi} from "../interface";
import {depositContractContainerType, specContainerType} from "../ssz";

export class CgEth2ConfigApi extends CgEth2Base implements CgConfigApi {
    public async getDepositContract(): Promise<{data: DepositContract}> {
        const response = await this.get<{data: Json}>("/eth/v1/config/deposit_contract");
        return {data: depositContractContainerType.fromJson(response.data, {case: "snake"})};
    }

    public async getForkSchedule(): Promise<{data: phase0.Fork[]}> {
        const response = await this.get<{data: Json[]}>("/eth/v1/config/fork_schedule");
        return {data: response.data.map((data) => ssz.phase0.Fork.fromJson(data, {case: "snake"}))};
    }

    public async getSpec(): Promise<{data: ISpec}> {
        const response = await this.get<{data: Json}>("/eth/v1/config/spec");
        return {data: specContainerType.fromJson(response.data, {case: "snake"})};
    }
}
