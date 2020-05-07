export interface IDockerRunParams {
    // OPTIONS
    // https://docs.docker.com/engine/reference/run/#name---name
    name: string;
    // https://docs.docker.com/engine/reference/run/#detached--d
    detached?: boolean;
    // https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities
    privileged?: boolean;
    // https://docs.docker.com/engine/reference/run/#ipc-settings---ipc
    // none | private | shareable | container: <_name-or-ID_> | host
    ipc?: string;
    // https://docs.docker.com/engine/reference/run/#restart-policies---restart
    // no | on-failure[:max-retries] | always | unless-stopped
    restart?: string;
    // https://docs.docker.com/engine/reference/run/#expose-incoming-ports
    publishAllPorts?: boolean;
    // [ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort | containerPort]
    ports?: DockerPort[];

    // IMAGE
    image: string;

    // COMMAND
    cmd?: string;

    // volume-name:mount-point - https://docs.docker.com/storage/volumes/
    volume?: string;
}

export type DockerPort = {
    local: string;
    host: string;
}
