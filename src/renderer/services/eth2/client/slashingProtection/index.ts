import {SlashingProtection} from "@chainsafe/lodestar-validator";

export class CGSlashingProtection extends SlashingProtection {
    public missingImportedSlashingProtection = async (publicKey: string): Promise<boolean> => {
        const uintPublicKey = new Uint8Array(Buffer.from(publicKey.substr(2), "hex"));

        // @ts-ignore
        const signedBlocks = await this.blockService.exportBlocks(uintPublicKey);
        // @ts-ignore
        const signedAttestations = await this.attestationService.exportAttestations(uintPublicKey);

        return !(signedBlocks.length || signedAttestations.length);
    };
}
