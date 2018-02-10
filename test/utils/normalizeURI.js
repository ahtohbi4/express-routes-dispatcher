import { assert } from 'chai';

import normalizeURI from '../../src/utils/normalizeURI';

describe('Function "normalizeURI"', function () {
    it('removes excess slashes', function () {
        assert.equal(normalizeURI('////foo///baz//////'), '/foo/baz/');
        assert.equal(normalizeURI('////foo//', '/baz//////'), '/foo/baz/');
    });

    it('joins several substrings', function () {
        assert.equal(normalizeURI('foo', 'baz', 'bar'), 'foo/baz/bar');
        assert.equal(normalizeURI('foo/', '/baz/', '/bar'), 'foo/baz/bar');
    });
});
