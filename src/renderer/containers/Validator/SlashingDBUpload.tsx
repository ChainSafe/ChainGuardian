import React, {ChangeEvent, useEffect, useState} from "react";
import {Modal} from "../../components/Modal/Modal";
import {validateSlashingFile} from "../../services/jsonValidation";
import {FileImport} from "../../components/FileImport/FileImport";
import {ButtonDestructive, ButtonPrimary, ButtonSecondary} from "../../components/Button/ButtonStandard";
import {useDispatch} from "react-redux";
import {
    slashingProtectionSkip,
    slashingProtectionCancel,
    slashingProtectionUpload,
} from "../../ducks/validator/actions";
import {CheckBox} from "../../components/CheckBox/CheckBox";

interface IProps {
    visible: boolean;
}

export const SlashingDBUpload: React.FC<IProps> = ({visible}) => {
    const [error, setError] = useState("");
    const [path, setPath] = useState<null | string>(null);
    const [fileName, setFileName] = useState<null | string>(null);
    const [isSkippable, setIsSkippable] = useState(false);

    useEffect(() => {
        if (!visible) {
            setError("");
            setPath(null);
            setFileName(null);
        }
    }, [visible]);

    const dispatch = useDispatch();

    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setError("");
        const filePath = event.target.files[0]?.path;
        setFileName(event.target.files[0].name);
        if (!filePath) {
            setFileName(null);
            setError("Please select a file");
        } else if (validateSlashingFile(filePath)) {
            setPath(filePath);
        } else {
            setError("File is incorrect, try again with different file");
        }
    };

    const onSkip = (): void => {
        dispatch(slashingProtectionSkip());
    };

    const onSubmit = (): void => {
        dispatch(slashingProtectionUpload());
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
                        <CheckBox
                            checked={isSkippable}
                            label="I'm aware that skipping can cause slashing."
                            id='slashing'
                            onClick={onCheckboxClick}
                        />
                        <span className='slashing-action-buttons'>
                            <ButtonSecondary buttonId='skip' disabled={!isSkippable} onClick={onSkip}>
                                Skip
                            </ButtonSecondary>
                            <ButtonPrimary buttonId='submit' disabled={!valid} onClick={onSubmit}>
                                Submit
                            </ButtonPrimary>
                            <ButtonDestructive buttonId='cancel' onClick={onCancel}>
                                Cancel
                            </ButtonDestructive>
                        </span>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
