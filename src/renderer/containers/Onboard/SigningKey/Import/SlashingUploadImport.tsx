import React, {ChangeEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {FileImport} from "../../../../components/FileImport/FileImport";
import {ButtonPrimary} from "../../../../components/Button/ButtonStandard";
import {useHistory} from "react-router-dom";
import {validateSlashingFile} from "../../../../services/jsonValidation";
import {setSlashingPath} from "../../../../ducks/register/actions";

export const SlashingUploadImport: React.FC = () => {
    const [error, setError] = useState("");
    const [path, setPath] = useState<null | string>(null);
    const [fileName, setFileName] = useState<null | string>(null);

    const dispatch = useDispatch();
    const history = useHistory();

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

    const onSubmit = (): void => {
        dispatch(setSlashingPath(path));
        history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
    };

    const valid = !error && !!path;
    return (
        <>
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
                <span className='submit-button-container'>
                    <ButtonPrimary buttonId='submit' disabled={!valid} onClick={onSubmit}>
                        Submit
                    </ButtonPrimary>
                </span>
            </div>
        </>
    );
};
