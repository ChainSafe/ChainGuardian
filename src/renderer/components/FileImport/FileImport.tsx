import React, {ChangeEvent} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faUpload} from "@fortawesome/free-solid-svg-icons";

interface IFileImportProps {
    fileName: string | null;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    name?: string;
    error?: string;
    accept?: string;
}

// TODO: implement drag and drop
export const FileImport: React.FC<IFileImportProps> = ({fileName, error, ...props}) => (
    <>
        <input type='file' className='inputfile' {...props} />
        <label htmlFor='file' className={error && "error"}>
            <FontAwesomeIcon icon={faUpload} transform={{x: -10}} />
            {!fileName ? "Choose a file..." : fileName}
            {error && <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' size='lg' />}
        </label>
        <div className={"error-message error-message-wide"} style={{marginLeft: "28px"}}>
            {error}
        </div>
    </>
);
