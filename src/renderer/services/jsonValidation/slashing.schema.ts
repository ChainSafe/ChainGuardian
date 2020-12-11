import Joi from "joi";
import {readFileSync} from "fs";

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3076.md
const schema = Joi.object({
    metadata: Joi.object({
        ["interchange_format_version"]: Joi.string().required(),
        ["genesis_validators_root"]: Joi.string().required(),
    }).required(),
    data: Joi.array()
        .items(
            Joi.object({
                pubkey: Joi.string().required(),
                ["signed_blocks"]: Joi.array()
                    .items(
                        Joi.object({
                            slot: Joi.string().required(),
                            ["signing_root"]: Joi.string(),
                        }),
                    )
                    .required(),
                ["signed_attestations"]: Joi.array()
                    .items(
                        Joi.object({
                            ["source_epoch"]: Joi.string().required(),
                            ["target_epoch"]: Joi.string().required(),
                            ["signing_root"]: Joi.string(),
                        }),
                    )
                    .required(),
            }),
        )
        .required(),
});

export const slashingJSONValidator = schema.validate;

export const validateSlashingFile = (path: string): boolean =>
    !schema.validate(JSON.parse(readFileSync(path).toString())).error;
