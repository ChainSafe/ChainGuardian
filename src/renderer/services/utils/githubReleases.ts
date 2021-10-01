import axios, {AxiosResponse} from "axios";
import {IGithubRelease} from "../../../../types/githubRelease.dto";
import {getDefaultsForClient} from "../eth2/client/defaults";

const gitHubReposInstance = axios.create({
    baseURL: "https://api.github.com/repos/",
    timeout: 1000,
});

export const getReleases = (owner: string, repo: string): Promise<AxiosResponse<IGithubRelease[]>> =>
    gitHubReposInstance.get<IGithubRelease[]>(`/${owner}/${repo}/releases`);

export const isCurrentOrNewerVersion = (current: string, comparingWith: string): boolean => {
    if (current === comparingWith) return true;

    const currentFragments = current.replace(/[^\d.-]/g, "").split(".");
    const comparingWithFragments = comparingWith.replace(/[^\d.-]/g, "").split(".");

    const length =
        currentFragments.length > comparingWithFragments.length
            ? currentFragments.length
            : comparingWithFragments.length;
    for (let i = 0; i < length; i++) {
        if ((Number(currentFragments[i]) || 0) === (Number(comparingWithFragments[i]) || 0)) continue;
        return (Number(comparingWithFragments[i]) || 0) > (Number(currentFragments[i]) || 0);
    }
    return true;
};

export const getAvailableClientReleases = async (
    client: string,
    versionPrefix: string,
    allowPrerelease = false,
): Promise<string[]> => {
    const {
        beacon: {dockerImage, owner, repo},
    } = getDefaultsForClient(client);
    const response = await getReleases(owner, repo);
    const currentTag = dockerImage.split(":")[1];
    return (
        response.data
            .filter(
                ({tag_name: tag, draft, prerelease}) =>
                    !draft &&
                    (allowPrerelease ? true : !prerelease) &&
                    isCurrentOrNewerVersion(currentTag, versionPrefix + tag),
            )
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            .map(({tag_name}) => dockerImage.split(":")[0] + ":" + versionPrefix + tag_name)
    );
};
