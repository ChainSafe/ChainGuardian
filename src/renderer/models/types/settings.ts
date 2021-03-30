import {ContainerType, BooleanType, NumberUintType} from "@chainsafe/ssz";
import {StringType} from "./basic";
import {Settings} from "../settings";

export const SettingsType = new ContainerType<Settings>({
    fields: {
        dockerPath: new StringType(),
        reporting: new BooleanType(),
        lastTrack: new NumberUintType({byteLength: 32}),
    },
});
