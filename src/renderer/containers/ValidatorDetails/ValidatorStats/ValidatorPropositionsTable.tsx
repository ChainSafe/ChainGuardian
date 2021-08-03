import React, {useEffect, useState} from "react";
import {PropositionDuty} from "../../../models/propositionDuties";
import database from "../../../services/db/api/database";
import {getDutyStatusText} from "../../../constants/dutyStatus";
import {format} from "date-fns";

interface IProps {
    publicKey: string;
    slot: number;
}

export const ValidatorPropositionsTable: React.FC<IProps> = ({publicKey, slot}) => {
    const [duties, setDuties] = useState<PropositionDuty[]>([]);
    useEffect(() => {
        database.validator.propositionDuties.get(publicKey).then(({records}) => setDuties(records.slice(0, 10)));
    }, [slot]);

    return (
        <div className='node-graph-container' style={{width: 625, height: 440, justifyContent: "start"}}>
            <div className='graph-header'>
                <div className='graph-title'>Last 10 Block Proposals</div>
            </div>
            <div className='graph-content'>
                <table className='validator-table'>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Epoch</th>
                            <th>Slot</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {duties.map((duty) => (
                            <tr key={duty.slot}>
                                <td>{format(duty.timestamp, "d MMMM yyyy HH:mm")}</td>
                                <td>{duty.epoch}</td>
                                <td>{duty.slot}</td>
                                <td>{getDutyStatusText(duty.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
