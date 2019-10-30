export class Routes {
    public static LOGIN_ROUTE = "/login";
    public static ONBOARD_ROUTE = "/onboard/:step/:substep";
    public static ONBOARD_ROUTE_EVALUATE = (step: string, substep: string): string => `/onboard/${step}/${substep}`;
}
