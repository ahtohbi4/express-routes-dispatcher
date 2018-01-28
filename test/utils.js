import { assert } from 'chai';

import {
    joinURI,
    noop,
} from '../src/utils';

describe('Function "joinURI"', function () {
    it('removes excess slashes', function () {
        assert.equal(joinURI('////foo///baz//////'), '/foo/baz/');
        assert.equal(joinURI('////foo//', '/baz//////'), '/foo/baz/');
    });

    it('joins several substrings', function () {
        assert.equal(joinURI('foo', 'baz', 'bar'), 'foo/baz/bar');
        assert.equal(joinURI('foo/', '/baz/', '/bar'), 'foo/baz/bar');
    });
});

describe('Function "noop"', function () {
    it('always returns null', function () {
        assert.equal(noop(), null);
    });
});
