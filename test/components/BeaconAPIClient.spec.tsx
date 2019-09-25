import { BeaconAPIClient } from '../../src/renderer/services/BeaconAPIClient';

jest.setTimeout(10000);

describe('Main window', () => {
    let client: BeaconAPIClient;

    beforeEach(() => {
        client = new BeaconAPIClient();
    });

    it('should return node version', async () => {
        const nodeVersion = await client.fetchNodeVersion();
        expect(nodeVersion).toBe('1');
    });

    it('should return genesis time', async () => {
        const genesisTime = await client.fetchGenesisTime();

        expect(genesisTime).toBe(2);
    });

    it('should return node syncing status', async () => {
        const syncing = {
            is_syncing: true,
            sync_status: {
                startingBlock: 1,
                currentBlock: 2,
                highestBlock: 3
            }
        };

        const syncingStatus = await client.fetchNodeSyncing();

        expect(syncingStatus).toMatchObject(syncing);
    });

    it('should return fork information', async () => {
        const fork = {
            chain_id: 1,
            fork: {
                previousVersion: 1,
                currentVersion: 2,
                epoch: 3
            }
        };

        const forkInformation = await client.fetchForkInformation();

        expect(forkInformation).toMatchObject(fork);
    });
});
