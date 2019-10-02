import { extractDockerVersion } from '../../../../src/main/Utils/Docker/docker-utils';

describe('Docker utils unit tests', () => {
    it('should successfully extract docker version.', async () => {
        expect(extractDockerVersion('Docker version 12.7.1, build 420')).toBe('12.7.1');
        expect(extractDockerVersion('Docker version 12.7.1')).toBe('12.7.1');
    }, 10000);

    it('should fail to extract docker version.', async () => {
        expect(extractDockerVersion('Version 12.7.1, build 420')).toBeNull();
        expect(extractDockerVersion('Docker 12.7.1, build 420')).toBeNull();
    }, 10000);
});
