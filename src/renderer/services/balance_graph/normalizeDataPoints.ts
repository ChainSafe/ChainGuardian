export enum Days {
    SUN = 0,MON,TUE,WED,THU,FRI,SAT,
}
export enum Months {
    JAN = 0,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC
}

const formatDate = (date: string): string=>{
    const month = date.slice(4,7).toUpperCase();
    const day = date.slice(8,10);
    return month + " " + day;
};

const dateToday = new Date();

export function normalizeHour (dataArray: Array<object>, array: number[]): Array<object> {
    const minute = dateToday.getMinutes();
    for (let i = 59; i >=0; i--) {
        dataArray.push({
            name: ((minute-i)<0 ? 60+(minute-i) : (minute-i)) + "'",
            value: array[i]
        });
    }
    return dataArray;
}

export function normalizeDay (dataArray: Array<object>, array: number[]): Array<object> {
    const hour = dateToday.getHours();
    for (let i = 23; i >=0; i--) {
        dataArray.push({
            name: ((hour-i)<1 ? 24+hour-i : hour-i) + "h",
            value: array[i]
        });
    }
    return dataArray;
}

export function normalizeWeek (dataArray: Array<object>, array: number[]): Array<object> {
    const day = dateToday.getDay();
    for (let i = 6; i >=0; i--) {
        dataArray.push({
            name: (day-i)<0 ? Days[7+day-i] : Days[day-i],
            value: array[i]
        });
    }
    return dataArray;
}

export function normalizeMonth (dataArray: Array<object>, array: number[]): Array<object> {
    for (let i = 29; i >=0; i--) {
        const yesterday = new Date(new Date().setDate(new Date().getDate()-i-30));
        dataArray.push({
            name: formatDate(yesterday.toString()),
            value: array[i]
        });
    }
    return dataArray;
}

export function normalizeYear (dataArray: Array<object>, array: number[]): Array<object> {
    const month = dateToday.getMonth();
    for (let i = 11; i >=0; i--) {
        dataArray.push({
            name: (month-i)<0 ? Months[12+month-i] : Months[month-i],
            value: array[i]
        });
    }
    return dataArray;
}