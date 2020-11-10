export class Routes {
    public static DASHBOARD_ROUTE = "/dashboard";
    public static LOGIN_ROUTE = "/login";
    public static ONBOARD_ROUTE = "/onboard/:step";
    public static VALIDATOR_DETAILS = "/details/:publicKey";
    public static BEACON_NODES = "/beacon-nodes";
    public static ADD_BEACON_NODE = "/add-beacon-node/:validatorKey";
    public static ONBOARD_ROUTE_EVALUATE = (step: OnBoardingRoutes): string => `/onboard/${step}`;
}

export enum OnBoardingRoutes {
    SIGNING = "1_0",
    SIGNING_IMPORT = "1_a1",
    SIGNING_IMPORT_MNEMONIC = "1_a1_mem",
    SIGNING_IMPORT_FILE = "1_a1_fil",
    SIGNING_KEY_GENERATE = "1_skg",
    SIGNING_KEY_VALIDATE = "1_skv",
    CONFIGURE = "2_0",
    CONFIGURE_DOCKER_PATH = "2_0_1",
    CONFIGURE_BEACON_NODE = "2_1",
    DEPOSIT_TX = "3_0",
    PASSWORD = "4_ps",
    CONSENT = "5_0",
}
