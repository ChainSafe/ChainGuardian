export class Routes {
    public static DASHBOARD_ROUTE = "/dashboard";
    public static LOGIN_ROUTE = "/login";
    public static ONBOARD_ROUTE = "/onboard/:step";
    public static CHECK_PASSWORD = "/checkpassword";
    public static VALIDATOR_DETAILS = "/details/:id";
    public static ONBOARD_ROUTE_EVALUATE = (step: OnBoardingRoutes): string => `/onboard/${step}`;
}

export enum OnBoardingRoutes {
    SIGNING = "1_0",
    SIGNING_IMPORT = "1_a1",
    SIGNING_KEY_GENERATE ="1_skg",
    SIGNING_KEY_VALIDATE ="1_skv",
    WITHDRAWAL = "2_0",
    WITHDRAWAL_IMPORT = "2_b1",
    WITHDRAWAL_KEY_GENERATE ="2_wkg",
    WITHDRAWAL_KEY_VALIDATE ="2_wkv",
    CONFIGURE = "3_0",
    CONFIGURE_DOCKER_PATH = "3_0_1",
    CONFIGURE_BEACON_NODE = "3_1",
    DEPOSIT_TX = "4_0",
    PASSWORD = "5_ps",
}
