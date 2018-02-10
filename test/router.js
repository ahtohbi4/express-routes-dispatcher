import request from 'request';
import { assert } from 'chai';
import { readFile } from 'fs';

import Router from '../src/Router';
import processedRoutes from './fixtures/processed_routes';
import routes from './fixtures/routes';

const req = request.defaults({
    baseUrl: 'http://localhost:3000',
});

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
        req.get('/non-existent-page/', (error, response) => {
            assert.equal(response.statusCode, 404);
            done();
        });
    });

    it('of existent page returns status 200 and correct body', (done) => {
        req.get('/', (error, response, body) => {
            assert.equal(response.statusCode, 200);
            readFile('test/fixtures/pages/index.html', (fileReadError, data) => {
                assert.equal(body, data);
                done();
            });
        });
    });

    it('of page with outputted __route object returns correct params', (done) => {
        req.get('/route/a/b/?foo=baz', (error, response, body) => {
            assert.equal(response.statusCode, 200);
            readFile('test/fixtures/pages/route.html', (fileReadError, data) => {
                assert.equal(body, data.toString());
                done();
            });
        });
    });

    it('of page with incorrect incorrect param in URI returns status 404', () => {
        req.get('/route/a/1/', (error, response) => {
            assert.equal(response.statusCode, 404);
        });
    });

    it('of page outputted generated path', (done) => {
        req.get('/path/', (error, response, body) => {
            assert.equal(response.statusCode, 200);
            readFile('test/fixtures/pages/path.html', (fileReadError, data) => {
                assert.equal(body, data.toString());
                done();
            });
        });
    });

    it('of /__routes__/ page', (done) => {
        req.get('/__routes__/', { json: true }, (error, response, body) => {
            assert.deepEqual(body, processedRoutes);
            done();
        });
    });
});
