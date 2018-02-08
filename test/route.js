import { assert } from 'chai';

import Route from '../src/Route';

describe('Class "Route"', () => {
    describe('throws an error when', () => {
        it(
            'both required parameters were missed',
            () => assert.throws(() => new Route(), Error),
        );
        it(
            'required parameter "name" was missed',
            () => assert.throws(() => new Route({ path: '/foo/' }), Error),
        );
        it(
            'required parameter "path" was missed',
            () => assert.throws(() => new Route({ name: 'foo' }), Error),
        );
    });

    describe('ee', () => {
        it(
            'ww',
            () => assert.deepNestedPropertyVal(new Route({
                name: 'foo',
                path: '/foo/',
            }), 'path', '/foo/')
        );
    });
});
