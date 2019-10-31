export class Routes {
    public static LOGIN_ROUTE = "/login";
    public static ONBOARD_ROUTE = "/onboard/:step/:substep";
    public static ONBOARD_ROUTE_EVALUATE = (step: string, substep: string): string => `/onboard/${step}/${substep}`;
}

export enum Subroutes {
    SIGNING = "1",
    SIGNING_ENTRANCE = "0",
    SIGNING_IMPORT = "a1",
    WITHDRAWAL = "2",
    WITHDRAWAL_IMPORT = "b1"
}
