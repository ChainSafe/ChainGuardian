import React, {ChangeEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {FileImport} from "../../../../components/FileImport/FileImport";
import {ButtonPrimary} from "../../../../components/Button/ButtonStandard";
import {RouteComponentProps} from "react-router-dom";
import {validateSlashingFile} from "../../../../services/jsonValidation";
import {setSlashingPath} from "../../../../ducks/register/actions";

type IOwnProps = Pick<RouteComponentProps, "history">;

export const SlashingUploadImport: React.FC<IOwnProps> = ({history}) => {
    const [error, setError] = useState("");
    const [path, setPath] = useState<null | string>(null);
    const [fileName, setFileName] = useState<null | string>(null);

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
            setError("File is incorrect, try again whit different file");
        }
    };

    const onSubmit = (): void => {
        dispatch(setSlashingPath(path));
        history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
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
