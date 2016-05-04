'use strict';

const HOST = 'localhost';
const PORT = 1337;

const fs = require('fs');
const path = require('path');
const request = require('request');
const url = require('url');

const express = require('express');
const app = express();

const router = require('../index.js');
router(app, {
    host: HOST,
    port: PORT,
    baseDir: __dirname,
    file: './routing/main_routing.json',
    debug: true
});

/**
 * @func
 * @param {string} path
 * @returns {string} Absolute URI to path
 */
function getAbsoluteURL(path) {
    return url.format({
        protocol: 'http',
        hostname: HOST,
        port: PORT,
        pathname: (path || '')
    });
}

/**
 * @returns {function}
 */
const counter = (() => {
    let count = 0;

    return () => {
        return count++;
    };
}());

describe('Routes maps', () => {
    beforeEach(() => {
        // Start server before each test
        this.server = app.listen(PORT, () => {
            this._id = counter();
            console.log(`\n[${this._id}] expressjs server listening on port ${PORT}.`);
        });
    });

    afterEach((done) => {
        // Stop server after each test
        this.server.close(() => {
            console.log(`[${this._id}] expressjs server on port ${PORT} was stopped!`);
            done();
        });
    });

    it('compiled compare with actual', (done) => {
        request.get(getAbsoluteURL('/_dev/routes/'), (error, response, body) => {
            let actualRouteMap = JSON.parse(body);
            let expectedRouteMap = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/routing/expected_routes_map.json`), 'utf8'));

            expect(Object.keys(actualRouteMap).length).toEqual(Object.keys(expectedRouteMap).length);

            for (let routeName in expectedRouteMap) {
                expect(expectedRouteMap[routeName]).toEqual(actualRouteMap[routeName]);
            }

            done();
        });

    });
});
