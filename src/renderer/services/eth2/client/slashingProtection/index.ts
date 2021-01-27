import {SlashingProtection} from "@chainsafe/lodestar-validator";
import {Interchange, InterchangeFormatVersion} from "@chainsafe/lodestar-validator/lib/slashingProtection/interchange";
import {Root} from "@chainsafe/lodestar-types";
import {fromHex} from "@chainsafe/lodestar-utils";

export class CGSlashingProtection extends SlashingProtection {
    public missingImportedSlashingProtection = async (publicKey: string): Promise<boolean> => {
        const uintPublicKey = fromHex(publicKey);
        // @ts-ignore
        const signedBlocks = await this.blockService.exportBlocks(uintPublicKey);
        // @ts-ignore
        const signedAttestations = await this.attestationService.exportAttestations(uintPublicKey);

        return !(signedBlocks.length || signedAttestations.length);
    };

    public exportSlashingJson = (genesisValidatorsRoot: Root, publicKey: string): Promise<Interchange> => {
        const uintPublicKey = fromHex(publicKey);
        // for now is hardcoded as only option for exporting db
        const interchangeFormatVersion: InterchangeFormatVersion = {
            format: "complete",
            version: "4",
        };

        return super.exportInterchange(genesisValidatorsRoot, [uintPublicKey], interchangeFormatVersion);
    };
}
