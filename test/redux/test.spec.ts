import { restClientReducer } from '../../src/renderer/reducers/restClientReducer';
import { setNodeVersion } from '../../src/renderer/actions/restClientActions';

describe('restClientReducer reducer', () => {
    it('should return the state after node version is fetched', () => {
        expect(restClientReducer(undefined, setNodeVersion('1'))).toEqual({
            version: '1'
        });
    });
});
