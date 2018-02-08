import { assert } from 'chai';

import createMetaObject from '../../src/utils/createMetaObject';

class Foo extends createMetaObject({
    baz: undefined,
}) {}

describe('Function "createMetaObject"', function () {
    it(
        'creation of instance without required parameters throws the error',
        () => assert.throws(() => new Foo(), Error),
    );

    it(
        'a base instance is a simple object',
        () => assert.deepEqual(
            new Foo({ baz: 'BAZ', foo: 'FOO' }),
            { baz: 'BAZ', foo: 'FOO' },
        ),
    );
})
