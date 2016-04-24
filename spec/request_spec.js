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

var counter = (function () {
    var count = 0;

    return function () {
        return count++;
    };
}())

describe('Response from', function () {
    // Start server before each test
    beforeEach(function () {
        this.server = app.listen(PORT, function () {
            this._id = counter();
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

    describe('non-existing URL', function () {
        it('returns status code 404', function (done) {
            request.get(getAbsoluteURL('/non-existent-page/'), function (error, response) {
                expect(response.statusCode).toBe(404);
                done();
            });
        });
    });

    describe('route without requirement attribute \'defaults._controller\'', function () {
        it('returns status code 500', function (done) {
            request.get(getAbsoluteURL('/route-without-controller/'), function (error, response, body) {
                expect(response.statusCode).toBe(500);
                // expect(body).toMatch(/Could not load controller &quot;&quot; for route &quot;route_without_controller&quot;./i);
                done();
            });
        });
    });

    describe('simple route with requirement attributes only', function () {
        it('returns status code 200', function (done) {
            request.get(getAbsoluteURL('/route-simple/'), function (error, response) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns JSON', function (done) {
            request.get(getAbsoluteURL('/route-simple/'), function (error, response, body) {
                expect(body).toMatch({});
                done();
            });
        });
    });

    describe('route for HTML but without template', function () {
        it('returns status code 500', function (done) {
            request.get(getAbsoluteURL('/route-for-html-without-template/'), function (error, response, body) {
                expect(response.statusCode).toBe(500);
                // expect(body).toMatch(/Template is not defined./i);
                done();
            });
        });
    });

    describe('route with template', function () {
        it('returns status code 200', function (done) {
            request.get(getAbsoluteURL('/route-with-template-without-format/'), function (error, response) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns \'Hello, World!\'', function (done) {
            request.get(getAbsoluteURL('/route-with-template-without-format/'), function (error, response, body) {
                expect(body).toMatch('Hello, World!');
                done();
            });
        });
    });

    describe('route for JSON with template', function () {
        it('returns status code 200', function (done) {
            request.get(getAbsoluteURL('/route-with-template-for-json/'), function (error, response) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns JSON', function (done) {
            request.get(getAbsoluteURL('/route-with-template-for-json/'), function (error, response) {
                expect(response.headers['content-type']).toMatch('application/json');
                done();
            });
        });

        it('returns JSON', function (done) {
            request.get(getAbsoluteURL('/route-with-template-for-json/'), function (error, response, body) {
                expect(body).toMatch({});
                done();
            });
        });
    });

    describe('route with param', function () {
        it('returns status code 404 for not matched \'val3\'', function (done) {
            request.get(getAbsoluteURL('/route-with-param/val3/'), function (error, response) {
                expect(response.statusCode).toBe(404);
                done();
            });
        });

        it('returns status code 200 for matched \'val1\'', function (done) {
            request.get(getAbsoluteURL('/route-with-param/val1/'), function (error, response) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns status code 200 for matched \'val2\'', function (done) {
            request.get(getAbsoluteURL('/route-with-param/val2/'), function (error, response) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe('route Only POST method is allowed', function () {
        it('returns status code 405 for GET', function (done) {
            request.get(getAbsoluteURL('/only-post-method-allowing/'), function (error, response) {
                expect(response.statusCode).toBe(405);
                done();
            });
        });

        it('returns status code 200 for POST', function (done) {
            request.get(getAbsoluteURL('/only-post-method-allowing/'), function (error, response) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    // @todo: add tests for external routes
});
