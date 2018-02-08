import request from 'request';
import { assert } from 'chai';
import { readFile } from 'fs';

import Router from '../src/Router';
import routes from './fixtures/routes';

const router = new Router(routes, {
    baseDir: 'test/fixtures',

    debug: true,
});

describe('Request', () => {
    before(() => {
        router.start();
    });

    after(() => {
        router.close();
    });

    it('of non existent page returns status 404', (done) => {
        request.get('http://localhost:3000/non-existent-page/', (error, response) => {
            assert.equal(response.statusCode, 404);
            done();
        });
    });

    it('of existent page returns status 200 and correct body', (done) => {
        request.get('http://localhost:3000/', (error, response, body) => {
            assert.equal(response.statusCode, 200);
            readFile('test/fixtures/pages/index.html', (fileReadError, data) => {
                assert.equal(body, data);
                done();
            });
        });
    });

    it('of page with outputted __route object returns correct params', (done) => {
        request.get('http://localhost:3000/route/1/2/?foo=baz', (error, response, body) => {
            assert.equal(response.statusCode, 200);
            readFile('test/fixtures/pages/route.html', (fileReadError, data) => {
                assert.equal(body, data.toString());
                done();
            });
        });
    })
});
