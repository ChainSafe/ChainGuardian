export class Routes {
    static LOGIN_ROUTE = "/login";
    static ONBOARD_ROUTE = "/onboard/:step/:substep";
    static ONBOARD_ROUTE_EVALUATE = (step: string, substep: string) => `/onboard/${step}/${substep}`
}
