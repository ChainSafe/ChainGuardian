import React, {ChangeEvent, FC, useState} from "react";
import {processKeystore} from "../../../../services/utils/processKeystore";
import {useDispatch} from "react-redux";
import {storeValidatorKeys} from "../../../../ducks/register/actions";
import {ButtonPrimary} from "../../../../components/Button/ButtonStandard";
import {OnBoardingRoutes, Routes} from "../../../../constants/routes";
import {RouteComponentProps} from "react-router-dom";

type IOwnProps = Pick<RouteComponentProps, "history">;

export const FileUploadImport: FC<IOwnProps> = ({history}) => {
    const [error, setError] = useState("");
    const [path, setPath] = useState<null | string>(null);
    
    const dispatch = useDispatch();
    
    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setError("");
        const filePath = event.target.files[0]?.path;
        if (!filePath) {
            setError("No selected file");
        } else {
            processKeystore(filePath)
                .then(() => {setPath(filePath);})
                .catch(e => {setError(e.message);});
        }
    };
    
    const onSubmit = (): void => {
        processKeystore(path)
            .then((r) => {
                dispatch(storeValidatorKeys(r.signingKey, r.withdrawalKey, r.signingKeyPath));
                history.replace(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.CONFIGURE));
            });
    };

    const valid = !error && !!path;
    return (<>
        <h1>Upload your keystore file</h1>
        <div className={"key-input-container mt-32"}>
            {/* TODO: improve styling */}
            {/* TODO: implement drag and drop */}
            <p>{error}</p>
            <input
                type="file"
                id="myFile"
                name="filename"
                accept="application/json"
                onChange={onChange}
            />
            <span className="submit-button-container">
                <ButtonPrimary buttonId="submit" disabled={!valid} onClick={onSubmit}>Submit</ButtonPrimary>
            </span>
        </div>
    </>);
};
