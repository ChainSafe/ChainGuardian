import React, {ChangeEvent, FC, useState} from "react";
import {processKeystore} from "../../../../services/utils/processKeystore";
import {useDispatch} from "react-redux";
import {setKeystorePath, setPublicKey as setPublicKeyAction} from "../../../../ducks/register/actions";
import {ButtonPrimary} from "../../../../components/Button/ButtonStandard";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {RouteComponentProps} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faUpload} from "@fortawesome/free-solid-svg-icons";

type IOwnProps = Pick<RouteComponentProps, "history">;

export const FileUploadImport: FC<IOwnProps> = ({history}) => {
    const [error, setError] = useState("");
    const [path, setPath] = useState<null | string>(null);
    const [fileName, setFileName] = useState<null | string>(null);
    const [publicKey, setPublicKey] = useState("");

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
        history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
    };

    const valid = !error && !!path;
    return (
        <>
            <h1>Upload your keystore file</h1>
            <div className={"key-input-container mt-32"}>
                {/* TODO: improve styling */}
                {/* TODO: implement drag and drop */}
                <input
                    type='file'
                    id='file'
                    name='filename'
                    accept='application/json'
                    className='inputfile'
                    onChange={onChange}
                />
                <label htmlFor='file' className={error && "error"}>
                    <FontAwesomeIcon icon={faUpload} transform={{x: -10}} />
                    {!fileName ? "Choose a file..." : fileName}
                    {error && <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' size='lg' />}
                </label>
                <div className={"error-message error-message-wide"} style={{marginLeft: "28px"}}>
                    {error}
                </div>
                <span className='submit-button-container'>
                    <ButtonPrimary buttonId='submit' disabled={!valid} onClick={onSubmit}>
                        Submit
                    </ButtonPrimary>
                </span>
            </div>
        </>
    );
};
