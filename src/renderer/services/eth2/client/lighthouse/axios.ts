import {parse as bigIntParse} from "json-bigint";

export const axiosConfig = {
    headers: {
        "Content-Type": "application/json"
    },
    transformRequest: [
        (data: string): string => {
            //this will remove quotations around numbers
            try {
                return JSON.stringify(data).replace(/"([0-9]+\.{0,1}[0-9]*)"/g, "$1");
            } catch (e) {
                return data;
            }
        }
    ],
    transformResponse: [
        (data: string): any => {
            try {
                return bigIntParse(data);
            } catch (e) {
                return data;
            }
        }
    ]
};
