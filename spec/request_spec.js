var HOST = 'localhost';
var PORT = 1337;

var request = require('request');
var url = require('url');

var express = require('express');
var app = express();

var router = require('../lib/index.js');
router(app, {
    host: HOST,
    port: PORT,
    baseDir: __dirname,
    file: './routing/main_routing.json'
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

describe('checking Status Code of response', function () {
    // Start server before each test
    beforeEach(function () {
        this.server = app.listen(PORT, function () {
            this._id = 'some id'; // @todo: generate ID
            console.log('[' + this._id + '] expressjs server listening on port ' + PORT + '.');
        });
    });

    // Stop server after each test
    afterEach(function (done) {
        this.server.close(function () {
            console.log('[' + this._id + '] expressjs server on port ' + PORT + ' was stopped!');
            done();
        });
    });

    describe('GET non-existent page', function () {
        it('returns status code 404', function (done) {
            request.get(getAbsoluteURL('/non-existent-page/'), function (error, response) {
                expect(response.statusCode).toBe(404);
                done();
            });
        });
    });

    describe('GET Route without defaults._controller', function () {
        it('returns Exception', function (done) {
            request.get(getAbsoluteURL('/route-without-controller/'), function (error, response, body) {
                expect(response.statusCode).toBe(500);
                expect(body).toMatch(/Could not load controller &quot;&quot; for route &quot;route_without_controller&quot;./i);
                done();
            });
        });
    });

    describe('GET Route without defaults._template and defaults._format', function () {
        it('returns json', function (done) {
            request.get(getAbsoluteURL('/route-without-template-and-format/'), function (error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(body).toBe({});
                done();
            });
        });
    });

    describe('GET URI allowing only POST method', function () {
        it('returns status code 405', function (done) {
            request.get(getAbsoluteURL('/only-post-method-allowing/'), function (error, response) {
                expect(response.statusCode).toBe(405);
                done();
            });
        });
    });
});
