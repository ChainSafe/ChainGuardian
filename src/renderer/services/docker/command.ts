import {dockerPath} from "./path";
import {IDockerRunParams} from "./type";
import {generateRunCommand} from "./utils";

export class Command {
    public static async run(params: IDockerRunParams): Promise<string> {
        const path = await dockerPath.getPath();
        return `${path} run ${generateRunCommand(params)}`;
    }

    public static async ps(
        containerName?: string,
        status?: "created" | "restarting" | "running" | "removing" | "paused" | "exited" | "dead"
    ): Promise<string> {
        const nameFilter = containerName ? ` --no-trunc --filter name=^/${containerName}$` : "";
        const statusFilter = status ? ` --filter status=${status}` : "";
        const path = await dockerPath.getPath();
        return `${path} ps -a${nameFilter}${statusFilter}`;
    }

    // Passed argument is used to check installation and path correctness
    public static async version(defaultPath?: string): Promise<string> {
        const path = defaultPath || await dockerPath.getPath();
        return `${path} -v`;
    }

    public static async stop(containerName: string): Promise<string> {
        const path = await dockerPath.getPath();
        return `${path} stop ${containerName}`;
    }

    public static async start(containerName: string): Promise<string> {
        const path = await dockerPath.getPath();
        return `${path} start ${containerName}`;
    }

    public static async restart(containerName: string): Promise<string> {
        const path = await dockerPath.getPath();
        return `${path} restart ${containerName}`;
    }

    public static async logs(containerName: string, follow?: boolean): Promise<string> {
        const path = await dockerPath.getPath();
        return `${path} logs${follow ? " --follow" : ""} ${containerName}`;
    }

    public static async kill(containerName: string): Promise<string> {
        const path = await dockerPath.getPath();
        return `${path} kill ${containerName}`;
    }
}
