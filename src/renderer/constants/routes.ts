export class Routes {
    public static LOGIN_ROUTE = "/login";
    public static ONBOARD_ROUTE = "/onboard/:step";
    public static ONBOARD_ROUTE_EVALUATE = (step: OnBoardingRoutes): string => `/onboard/${step}`;
}

export enum OnBoardingRoutes {
    SIGNING = "1_0",
    SIGNING_IMPORT = "1_a1",
    WITHDRAWAL_IMPORT = "2_b1"
}
