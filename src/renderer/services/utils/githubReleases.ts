import axios, {AxiosResponse} from "axios";
import {IGithubRelease} from "../../../../types/githubRelease.dto";

const gitHubReposInstance = axios.create({
    baseURL: "https://api.github.com/repos/",
    timeout: 1000,
});

export const getReleases = (owner: string, repo: string): Promise<AxiosResponse<IGithubRelease[]>> =>
    gitHubReposInstance.get<IGithubRelease[]>(`/${owner}/${repo}/releases`);

const isCurrentOrNewerVersion = (current: string, comparingWith: string): boolean => {
    const currentFragments = current.replace(/[^\d.-]/g, "").split(".");
    const comparingWithFragments = comparingWith.replace(/[^\d.-]/g, "").split(".");

    const length =
        currentFragments.length > comparingWithFragments.length
            ? currentFragments.length
            : comparingWithFragments.length;
    for (let i = 0; i < length; i++) {
        if ((Number(currentFragments[i]) || 0) > (Number(comparingWithFragments[i]) || 0)) return false;
    }
    return true;
};

export const getAvailableClientReleases = async (client: string): Promise<string[]> => {
    const response = await ((): Promise<AxiosResponse<IGithubRelease[]>> => {
        switch (client) {
            case "teku":
                return getReleases("ConsenSys", "teku");
            case "lighthouse":
                return getReleases("sigp", "lighthouse");
            case "prysm":
                return getReleases("prysmaticlabs", "prysm");
            case "nimbus":
                return getReleases("status-im", "nimbus-eth2");
            default:
                throw Error(`Client "${client}" not implemented`);
        }
    })();
    const defaultImage = ((): string => {
        switch (client) {
            case "teku":
                return process.env.DOCKER_TEKU_IMAGE;
            case "lighthouse":
                return process.env.DOCKER_LIGHTHOUSE_IMAGE;
            case "prysm":
                return process.env.DOCKER_PRYSM_IMAGE;
            case "nimbus":
                return process.env.DOCKER_NIMBUS_IMAGE;
            default:
                throw Error(`Client "${client}" not implemented`);
        }
    })();
    const currentTag = defaultImage.split(":")[1];
    return (
        response.data
            .filter(
                // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                ({tag_name, draft, prerelease}) =>
                    !draft && !prerelease && isCurrentOrNewerVersion(currentTag, tag_name),
            )
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            .map(({tag_name}) => defaultImage.split(":")[0] + ":" + tag_name)
    );
};
