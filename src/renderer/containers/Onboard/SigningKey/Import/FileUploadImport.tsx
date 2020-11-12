import React, {ChangeEvent, FC, useState} from "react";
import {processKeystore} from "../../../../services/utils/processKeystore";
import {useDispatch} from "react-redux";
import {setKeystorePath, setPublicKey as setPublicKeyAction} from "../../../../ducks/register/actions";
import {ButtonPrimary} from "../../../../components/Button/ButtonStandard";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {RouteComponentProps} from "react-router-dom";
import {FileImport} from "../../../../components/FileImport/FileImport";
import {CheckBox} from "../../../../components/CheckBox/CheckBox";

type IOwnProps = Pick<RouteComponentProps, "history">;

export const FileUploadImport: FC<IOwnProps> = ({history}) => {
    const [error, setError] = useState("");
    const [path, setPath] = useState<null | string>(null);
    const [fileName, setFileName] = useState<null | string>(null);
    const [publicKey, setPublicKey] = useState("");
    const [checked, setChecked] = useState(false);

    const dispatch = useDispatch();

    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setError("");
        const filePath = event.target.files[0]?.path;
        if (!filePath) {
            setFileName(null);
            setError("Please select a file");
        } else {
            setFileName(event.target.files[0].name);
            try {
                setPublicKey(processKeystore(filePath));
                setPath(filePath);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const onSubmit = (): void => {
        dispatch(setKeystorePath(path));
        dispatch(setPublicKeyAction(publicKey));
        if (checked) {
            history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING_IMPORT_SLASHING_FILE));
        } else {
            history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.PASSWORD));
        }
    };

    const onCheckboxClick = (): void => {
        setChecked(!checked);
    };

    const valid = !error && !!path;
    return (
        <>
            <h1>Upload your keystore file</h1>
            <div className={"key-input-container mt-32"}>
                <FileImport
                    onChange={onChange}
                    fileName={fileName}
                    error={error}
                    accept='application/json'
                    id='file'
                    name='filename'
                />
                <CheckBox checked={checked} label="I'm switching validator" id='slashing' onClick={onCheckboxClick} />
                <span className='submit-button-container'>
                    <ButtonPrimary buttonId='submit' disabled={!valid} onClick={onSubmit}>
                        Submit
                    </ButtonPrimary>
                </span>
            </div>
        </>
    );
};
