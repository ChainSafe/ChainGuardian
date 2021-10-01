import {ContainerType, BooleanType, NumberUintType} from "@chainsafe/ssz";
import {Settings} from "../settings";
import {StringType} from "@chainsafe/lodestar-types";

export const SettingsType = new ContainerType<Settings>({
    fields: {
        dockerPath: new StringType(),
        reporting: new BooleanType(),
        lastTrack: new NumberUintType({byteLength: 32}),
    },
});
