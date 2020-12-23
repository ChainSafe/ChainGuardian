import React, {ChangeEvent, useEffect, useState} from "react";
import {Modal} from "../../components/Modal/Modal";
import {FileImport} from "../../components/FileImport/FileImport";
import {ButtonDestructive, ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {useDispatch} from "react-redux";
import {
    slashingProtectionSkip,
    slashingProtectionCancel,
    slashingProtectionUpload,
} from "../../ducks/validator/actions";
import {CheckBox} from "../../components/CheckBox/CheckBox";
import {validateSlashingFile} from "../../services/utils/validateSlashingFile";
import {readBeaconChainNetwork} from "../../services/eth2/client";
import {CgEth2ApiClient} from "../../services/eth2/client/eth2ApiClient";
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {Root} from "@chainsafe/lodestar-types/lib/types/primitive";

interface IProps {
    visible: boolean;
    url: string;
}

export const SlashingDBUpload: React.FC<IProps> = ({visible, url}) => {
    const [error, setError] = useState("");
    const [path, setPath] = useState<null | string>(null);
    const [fileName, setFileName] = useState<null | string>(null);
    const [isSkippable, setIsSkippable] = useState(false);

    const [config, setConfig] = useState<null | IBeaconConfig>(null);
    const [genesisRoot, setGenesisRoot] = useState<null | Root>(null);

    useEffect(() => {
        if (!visible) {
            setError("");
            setPath(null);
            setFileName(null);
        }
    }, [visible]);

    const dispatch = useDispatch();

    const onChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setError("");
        const filePath = event.target.files[0]?.path;
        setFileName(event.target.files[0].name);
        if (!filePath) {
            setFileName(null);
            setError("Please select a file");
        } else {
            const validatorConfig = config || (await readBeaconChainNetwork(url))?.eth2Config;
            if (!config) setConfig(validatorConfig);

            let validatorGenesisRoot = genesisRoot;
            if (!validatorGenesisRoot) {
                const eth2API = new CgEth2ApiClient(validatorConfig, url);
                const genesis = await eth2API.beacon.getGenesis();
                validatorGenesisRoot = genesis.genesisValidatorsRoot;
                setGenesisRoot(genesis.genesisValidatorsRoot);
            }
            if (validateSlashingFile(filePath, validatorConfig, validatorGenesisRoot)) {
                setPath(filePath);
            } else {
                setError("File is incorrect, try again with different file");
            }
        }
    };

    const onSkip = (): void => {
        dispatch(slashingProtectionSkip());
    };

    const onSubmit = (): void => {
        dispatch(slashingProtectionUpload(path));
    };

    const onCancel = (): void => {
        dispatch(slashingProtectionCancel());
    };

    const onCheckboxClick = (): void => {
        setIsSkippable(!isSkippable);
    };

    const valid = !error && !!path;
    return (
        <div className={`confirmModalContainer ${visible ? "" : "none"}`}>
            <div style={{marginTop: "350px"}}>
                <Modal>
                    <h1>Upload your slashing json file</h1>
                    <div className={"key-input-container mt-32"}>
                        <FileImport
                            onChange={onChange}
                            fileName={fileName}
                            error={error}
                            accept='application/json'
                            id='file'
                            name='filename'
                        />
                        <span className='slashing-action-buttons'>
                            <ButtonPrimary buttonId='submit' disabled={!valid} onClick={onSubmit}>
                                Submit
                            </ButtonPrimary>
                            <ButtonDestructive buttonId='cancel' onClick={onCancel}>
                                Cancel
                            </ButtonDestructive>
                        </span>

                        <h4 className='slashing-or'>OR</h4>

                        <span className='slashing-skip-button'>
                            <ButtonSecondary buttonId='skip' disabled={!isSkippable} onClick={onSkip}>
                                Skip
                            </ButtonSecondary>
                            <CheckBox
                                checked={isSkippable}
                                label="I'm aware that skipping can cause slashing."
                                id='slashing'
                                onClick={onCheckboxClick}
                            />
                        </span>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
