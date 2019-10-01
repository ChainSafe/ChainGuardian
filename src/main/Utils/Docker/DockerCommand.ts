import { DockerRunParams, generateRunCommand } from './DockerRunParams';

export class DockerCommand {
    public static run(params: DockerRunParams): string {
        return `docker run ${generateRunCommand(params)}`;
    }

    public static ps(
        containerName?: string,
        status?: 'created' | 'restarting' | 'running' | 'removing' | 'paused' | 'exited' | 'dead'
    ): string {
        const nameFilter = containerName ? ` --no-trunc --filter name=^/${containerName}$` : '';
        const statusFilter = status ? ` --filter status=${status}` : '';
        return `docker ps -a${nameFilter}${statusFilter}`;
    }

    public static version(): string {
        return 'docker -v';
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
}
