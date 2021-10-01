import {Api as BeaconApi} from "@chainsafe/lodestar-api/lib/routes/beacon";
import {Api as ConfigApi} from "@chainsafe/lodestar-api/lib/routes/config";
import {Api as DebugApi} from "@chainsafe/lodestar-api/lib/routes/debug";
import {Api as EventsApi} from "@chainsafe/lodestar-api/lib/routes/events";
import {Api as NodeApi} from "@chainsafe/lodestar-api/lib/routes/node";
import {Api as ValidatorApi} from "@chainsafe/lodestar-api/lib/routes/validator";
import {Api as LodestarApi} from "@chainsafe/lodestar-api/lib/routes/lodestar";
import {Api as LightclientApi} from "@chainsafe/lodestar-api/lib/routes/lightclient";
import {Epoch, Number64, phase0, Root, Slot} from "@chainsafe/lodestar-types";
import {EventType} from "./enums";

export type CgBeaconApi = BeaconApi & {
    getPoolStatus(): Promise<PoolStatus>;
    getWeakSubjectivityCheckpoint(): Promise<string>;
};
export type CgConfigApi = ConfigApi;
export type CgDebugApi = DebugApi;
export type CgEventsApi = Omit<EventsApi, "eventstream"> & {
    eventstream(
        topics: Topics[],
        signal: AbortSignal,
        onEvent: (event: BeaconEvent) => void,
        softErrorHandling?: boolean,
    ): Promise<void>;
};
export type CgNodeApi = NodeApi;
export type CgValidatorApi = ValidatorApi;
export type CgLodestarApi = LodestarApi;
export type CgLightclientApi = LightclientApi;

export type Eth2Api = {
    beacon: CgBeaconApi;
    config: CgConfigApi;
    debug: CgDebugApi;
    events: CgEventsApi;
    node: CgNodeApi;
    validator: CgValidatorApi;
    //
    lightclient: CgLightclientApi;
    lodestar: CgLodestarApi;
};

export type Topics =
    | EventType.block
    | EventType.attestation
    | EventType.voluntaryExit
    | EventType.head
    | EventType.finalizedCheckpoint
    | EventType.chainReorg;

export type EventData = {
    [EventType.head]: {
        slot: Slot;
        block: Root;
        state: Root;
        epochTransition: boolean;
        previousDutyDependentRoot: Root;
        currentDutyDependentRoot: Root;
    };
    [EventType.block]: {
        slot: Slot;
        block: Root;
    };
    [EventType.attestation]: phase0.Attestation;
    [EventType.voluntaryExit]: phase0.SignedVoluntaryExit;
    [EventType.finalizedCheckpoint]: {
        block: Root;
        state: Root;
        epoch: Epoch;
    };
    [EventType.chainReorg]: {
        slot: Slot;
        depth: Number64;
        oldHeadBlock: Root;
        newHeadBlock: Root;
        oldHeadState: Root;
        newHeadState: Root;
        epoch: Epoch;
    };
    [EventType.error]: unknown;
};
export type BeaconEvent = {
    [K in EventType]: {
        type: K;
        message: EventData[K];
    };
}[EventType];

export type PoolStatus = {
    attestations: number;
    attesterSlashings: number;
    voluntaryExits: number;
    proposerSlashings: number;
};

export type SlotRoot = {slot: Slot; root: Root};
