export interface DockerRunParams {
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
    ports?: string;

    // IMAGE
    image: string;

    // COMMAND
    cmd?: string;
}

// docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND]
export function generateRunCommand(params: DockerRunParams) {
    const ports = params.publishAllPorts ? ' -P' : params.ports ? `-p=${params.ports}` : '';
    const options = `--name ${params.name}${params.detached ? ' -d' : ''}${
        params.privileged ? ` --privileged=${params.privileged}` : ''
    }${params.ipc ? ` --ipc="${params.ipc}"` : ''}${params.restart ? ` --restart=${params.restart}` : ''}${ports}`;
    return `${options} ${params.image} ${params.cmd ? params.cmd : ''}`;
}
