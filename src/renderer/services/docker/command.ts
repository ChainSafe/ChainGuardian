import {IDockerRunParams} from "./type";
import {generateRunCommand} from "./utils";

export class Command {
    public static run(params: IDockerRunParams): string {
        return `docker run ${generateRunCommand(params)}`;
    }

    public static ps(
        containerName?: string,
        status?: "created" | "restarting" | "running" | "removing" | "paused" | "exited" | "dead"
    ): string {
        const nameFilter = containerName ? ` --no-trunc --filter name=^/${containerName}$` : "";
        const statusFilter = status ? ` --filter status=${status}` : "";
        return `docker ps -a${nameFilter}${statusFilter}`;
    }

    public static version(): string {
        return "docker -v";
    }

    public static stop(containerName: string): string {
        return `docker stop ${containerName}`;
    }

    public static start(containerName: string): string {
        return `docker start ${containerName}`;
    }

    public static restart(containerName: string): string {
        return `docker restart ${containerName}`;
    }

    public static logs(containerName: string, follow?: boolean): string {
        return `docker logs${follow ? " --follow" : ""} ${containerName}`;
    }

    public static kill(containerName: string): string {
        return `docker kill ${containerName}`;
    }

    public static removeContainer(containerName: string): string {
        return `docker container rm -v ${containerName}`;
    }

    public static lsContainer(): string {
        return "docker container ls -a";
    }
}
