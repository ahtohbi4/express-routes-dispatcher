import { assert } from 'chai';

import normalizeURI from '../../src/utils/normalizeURI';

describe('Function "normalizeURI"', () => {
    it('removes excess slashes', () => {
        assert.equal(normalizeURI('////foo///baz//////'), '/foo/baz/');
        assert.equal(normalizeURI('////foo//', '/baz//////'), '/foo/baz/');
    });

    it('joins several substrings', () => {
        assert.equal(normalizeURI('foo', 'baz', 'bar'), 'foo/baz/bar');
        assert.equal(normalizeURI('foo/', '/baz/', '/bar'), 'foo/baz/bar');
    });
});
