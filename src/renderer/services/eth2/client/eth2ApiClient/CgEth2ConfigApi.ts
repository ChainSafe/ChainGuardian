import {CgEth2Base} from "./CgEth2Base";
import {DepositContract, ISpec} from "@chainsafe/lodestar-api/lib/routes/config";
import {Json, ContainerType, ByteVectorType} from "@chainsafe/ssz";
import {ssz, phase0} from "@chainsafe/lodestar-types";
import {ChainConfig} from "@chainsafe/lodestar-config";
import {BeaconPreset} from "@chainsafe/lodestar-params";
import {CgConfigApi} from "../interface";

export class CgEth2ConfigApi extends CgEth2Base implements CgConfigApi {
    private depositContractContainerType = new ContainerType<DepositContract>({
        fields: {
            chainId: ssz.Number64,
            address: new ByteVectorType({length: 20}),
        },
    });

    private specContainerType = new ContainerType<ISpec>({
        fields: {
            ...BeaconPreset.fields,
            ...ChainConfig.fields,
        },
    });

    public async getDepositContract(): Promise<{data: DepositContract}> {
        const response = await this.get<{data: Json}>("/eth/v1/config/deposit_contract");
        return {data: this.depositContractContainerType.fromJson(response.data, {case: "snake"})};
    }

    public async getForkSchedule(): Promise<{data: phase0.Fork[]}> {
        const response = await this.get<{data: Json[]}>("/eth/v1/config/fork_schedule");
        return {data: response.data.map((data) => ssz.phase0.Fork.fromJson(data, {case: "snake"}))};
    }

    public async getSpec(): Promise<{data: ISpec}> {
        const response = await this.get<{data: Json}>("/eth/v1/config/spec");
        return {data: this.specContainerType.fromJson(response.data, {case: "snake"})};
    }
}
