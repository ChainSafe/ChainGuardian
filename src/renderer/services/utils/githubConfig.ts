import axios, {AxiosResponse} from "axios";
import dockerJson from "../../../../docker.json";

const gitHubInstance = axios.create({
    baseURL: "https://api.github.com/repos/NodeFactoryIo/ChainGuardian/contents/",
    timeout: 1000,
    params: {ref: process.env.NODE_ENV === "production" ? "master" : "develop"},
});

interface IGitHubContentResponse {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    // eslint-disable-next-line camelcase
    html_url: string;
    // eslint-disable-next-line camelcase
    git_url: string;
    // eslint-disable-next-line camelcase
    download_url: string;
    type: string;
    content: string;
    encoding: string;
    _links: {
        self: string;
        git: string;
        html: string;
    };
}

export interface IDockerJson {
    images: {
        [image: string]: {
            current: string;
            backwards: Array<{
                version: string;
                image: string;
            }>;
        };
    };
}

export const getDockerConfig = async (): Promise<IDockerJson> => {
    if (process.env.NODE_ENV === "development") {
        return dockerJson;
    }
    const response: AxiosResponse<IGitHubContentResponse> = await gitHubInstance.get("docker.json");
    return JSON.parse(atob(response.data.content));
};

export const getDockerImage = async (client: string): Promise<string> => {
    try {
        const config = await getDockerConfig();
        if (!config.images[client]) {
            throw new Error(`Config for ${client} not found`);
        }
        const version = process.env.npm_package_version.split(".").map(Number);
        let image: string;
        for (const backward of config.images[client].backwards) {
            const [major, minor, patch] = backward.version.split(".").map(Number);
            if (major >= version[0] && minor >= version[1] && patch >= version[2]) image = backward.image;
        }
        if (image) return image;
        return config.images[client].current;
    } catch (error) {
        switch (client) {
            case "lighthouse":
                return process.env.DOCKER_LIGHTHOUSE_IMAGE;
            default:
                throw error;
        }
    }
};
