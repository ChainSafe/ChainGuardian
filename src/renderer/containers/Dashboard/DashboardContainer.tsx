import * as React from "react";
import {ReactNode} from "react";
import {ValidatorSimple} from "../../components/Validator/ValidatorSimple";


export default class DashboardContainer extends React.Component {
    public render(): ReactNode {
        return (
            <>
                <h1>Title</h1>
                <ValidatorSimple
                    deposit={20}
                    name={"Name"}
                    onExportClick={(): void => {}}
                    onRemoveClick={(): void => {}}
                    publicKey={"0x1233456789012345456"}
                    status={"WORKING"}
                />
            </>
        );
    }
}