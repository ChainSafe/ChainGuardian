export class Routes {
    public static DASHBOARD_ROUTE = "/dashboard";
    public static LOGIN_ROUTE = "/login";
    public static SETTINGS = "/settings";
    public static ONBOARD_ROUTE = "/onboard/:step";
    public static VALIDATOR_DETAILS = "/details/:publicKey";
    public static BEACON_NODES = "/beacon-nodes";
    public static BEACON_NODE_DETAILS = "/beacon-node/:url";
    public static ADD_BEACON_NODE = "/add-beacon-node/:validatorKey";
    public static ASSIGN_BEACON_NODE = "/assign-beacon-node/:validatorKey";
    public static ONBOARD_ROUTE_EVALUATE = (step: OnBoardingRoutes): string => `/onboard/${step}`;
}

export enum OnBoardingRoutes {
    SIGNING = "1_0",
    SIGNING_IMPORT_FILE = "1_1",
    SIGNING_IMPORT_MNEMONIC = "1_2",
    CONFIGURE = "2_0",
    PASSWORD = "3_0",
    CONSENT = "4_0",
}
