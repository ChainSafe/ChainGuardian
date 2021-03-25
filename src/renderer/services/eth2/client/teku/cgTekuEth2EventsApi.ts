import {BeaconEventType} from "@chainsafe/lodestar-validator/lib/api/interface/events";
import {CGBeaconEventType, CGBeaconEvent} from "../interface";
import {CgEth2EventsApi} from "../eth2ApiClient/cgEth2EventsApi";

export class CgTekuEth2EventsApi extends CgEth2EventsApi {
    protected deserializeBeaconEventMessage = (msg: MessageEvent): CGBeaconEvent => {
        switch (msg.type) {
            case CGBeaconEventType.BLOCK: {
                const data = JSON.parse(msg.data);
                const fixedData = {
                    slot: data.message.slot,
                    block:
                        "0x" +
                        Buffer.from(
                            this.config.types.SignedBeaconBlock.hashTreeRoot(
                                this.config.types.SignedBeaconBlock.fromJson(data, {case: "snake"}),
                            ),
                        ).toString("hex"),
                };
                return {
                    type: BeaconEventType.BLOCK,
                    message: this.deserializeEventData(this.config.types.BlockEventPayload, JSON.stringify(fixedData)),
                };
            }
            case CGBeaconEventType.CHAIN_REORG:
                return {
                    type: BeaconEventType.CHAIN_REORG,
                    message: this.deserializeEventData(this.config.types.ChainReorg, msg.data),
                };
            case CGBeaconEventType.HEAD:
                return {
                    type: BeaconEventType.HEAD,
                    message: this.deserializeEventData(this.config.types.ChainHead, msg.data),
                };
            case CGBeaconEventType.FINALIZED_CHECKPOINT:
                return {
                    type: CGBeaconEventType.FINALIZED_CHECKPOINT,
                    message: this.deserializeEventData(this.config.types.FinalizedCheckpoint, msg.data),
                };
            case CGBeaconEventType.ATTESTATION:
                return {
                    type: CGBeaconEventType.ATTESTATION,
                    message: this.deserializeEventData(this.config.types.Attestation, msg.data),
                };
            default:
                throw new Error("Unsupported beacon event type " + msg.type);
        }
    };
}
