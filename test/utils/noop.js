import { assert } from 'chai';

import noop from '../../src/utils/noop';

describe('Function "noop"', function () {
    it('always returns null', function () {
        assert.equal(noop(), null);
    });
});
