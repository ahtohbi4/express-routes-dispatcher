import { assert } from 'chai';

import Route from '../src/Route';

describe('Class "Route"', () => {
    describe('throws an error when', () => {
        it('both required parameters were missed', () => assert.throws(
            () => new Route(),
            Error,
        ));

        it('required parameter "name" was missed', () => assert.throws(
            () => new Route({ path: '/foo/' }),
            Error,
        ));

        it('required parameter "path" was missed', () => assert.throws(
            () => new Route({ name: 'foo' }),
            Error,
        ));
    });

    describe('creates', () => {
        it('a correct instance with default optional parameters', () => assert.deepNestedInclude(
            new Route({
                name: 'foo',
                path: '/foo/',
            }),
            {
                defaults: {},
                methods: ['get', 'post'],
                name: 'foo',
                path: '/foo/',
                requirements: {},
            },
        ));

        it('a correct instance with custom optional parameters', () => assert.deepNestedInclude(
            new Route({
                defaults: {
                    key: 'value',
                },
                methods: ['get'],
                name: 'foo',
                path: '/foo/{key}/',
                requirements: {
                    key: '\\[a-z]{3,}',
                },
            }),
            {
                defaults: {
                    key: 'value',
                },
                methods: ['get'],
                name: 'foo',
                path: '/foo/{key}/',
                requirements: {
                    key: '\\[a-z]{3,}',
                },
            },
        ));
    });
});
