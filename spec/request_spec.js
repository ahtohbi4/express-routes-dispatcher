'use strict';

const HOST = 'localhost';
const PORT = 1337;

const request = require('request');
const url = require('url');

const express = require('express');
const app = express();

const Twig = require('twig');
app.set('views', __dirname);
app.set('view engine', 'twig');

const router = require('../index.js');
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

/**
 * @returns {function}
 */
const counter = (() => {
    let count = 0;

    return () => {
        return count++;
    };
}());

describe('Response from', () => {
    beforeEach(() => {
        // Start server before each test
        this.server = app.listen(PORT, () => {
            this._id = counter();
            console.log('\n[' + this._id + '] expressjs server listening on port ' + PORT + '.');
        });
    });

    afterEach((done) => {
        // Stop server after each test
        this.server.close(() => {
            console.log('[' + this._id + '] expressjs server on port ' + PORT + ' was stopped!');
            done();
        });
    });

    describe('non-existing URL', () => {
        it('returns status code 404', (done) => {
            request.get(getAbsoluteURL('/non-existent-page/'), (error, response) => {
                expect(response.statusCode).toBe(404);
                done();
            });
        });
    });

    describe('route without requirement attribute "defaults._controller"', () => {
        it('returns status code 500', (done) => {
            request.get(getAbsoluteURL('/route-without-controller/'), (error, response) => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it('returns error message', (done) => {
            request.get(getAbsoluteURL('/route-without-controller/'), (error, response, body) => {
                expect(body).toMatch(/Could not load controller &quot;&quot; for route &quot;route_without_controller&quot;\./i);
                done();
            });
        });
    });

    describe('simple route with requirement attributes only', () => {
        it('returns status code 200', (done) => {
            request.get(getAbsoluteURL('/route-simple/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns JSON', (done) => {
            request.get(getAbsoluteURL('/route-simple/'), (error, response, body) => {
                expect(JSON.parse(body)).toEqual({
                    data: {}
                });
                done();
            });
        });
    });

    describe('route for HTML but without template', () => {
        it('returns status code 500', (done) => {
            request.get(getAbsoluteURL('/route-for-html-without-template/'), (error, response) => {
                expect(response.statusCode).toBe(500);
                done();
            });
        });

        it('returns error message', (done) => {
            request.get(getAbsoluteURL('/route-for-html-without-template/'), (error, response, body) => {
                expect(body).toMatch(/Template for route "route_for_html_without_template" is not defined\./i);
                done();
            });
        });
    });

    describe('route with template', () => {
        it('returns status code 200', (done) => {
            request.get(getAbsoluteURL('/route-with-template-without-format/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns "Hello, World!"', (done) => {
            request.get(getAbsoluteURL('/route-with-template-without-format/'), (error, response, body) => {
                expect(body).toBe('Hello, World!');
                done();
            });
        });
    });

    describe('route for JSON with template', () => {
        it('returns status code 200', (done) => {
            request.get(getAbsoluteURL('/route-with-template-for-json/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns JSON', (done) => {
            request.get(getAbsoluteURL('/route-with-template-for-json/'), (error, response) => {
                expect(response.headers['content-type']).toMatch(/application\/json/i);
                done();
            });
        });

        // @todo: this suit crushes server
        xit('returns JSON', (done) => {
            request.get(getAbsoluteURL('/route-with-template-for-json/'), (error, response, body) => {
                expect(JSON.parse(body)).toEqual({
                    data: {}
                });
                done();
            });
        });
    });

    describe('route with param', () => {
        it('returns status code 404 for not matched "val3"', (done) => {
            request.get(getAbsoluteURL('/route-with-param/val3/'), (error, response) => {
                expect(response.statusCode).toBe(404);
                done();
            });
        });

        it('returns status code 200 for matched "val1"', (done) => {
            request.get(getAbsoluteURL('/route-with-param/val1/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns "Parameter from URL is \'val1\'"', (done) => {
            request.get(getAbsoluteURL('/route-with-param/val1/'), (error, response, body) => {
                expect(body).toBe('Parameter from URL is \'val1\'');
                done();
            });
        });

        it('returns status code 200 for matched "val2"', (done) => {
            request.get(getAbsoluteURL('/route-with-param/val2/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns "Parameter from URL is \'val2\'"', (done) => {
            request.get(getAbsoluteURL('/route-with-param/val2/'), (error, response, body) => {
                expect(body).toBe('Parameter from URL is \'val2\'');
                done();
            });
        });
    });

    describe('route Only POST method is allowed', () => {
        it('returns status code 405 for GET', (done) => {
            request.get(getAbsoluteURL('/only-post-method-allowing/'), (error, response) => {
                expect(response.statusCode).toBe(405);
                done();
            });
        });

        it('returns status code 200 for POST', (done) => {
            request.get(getAbsoluteURL('/only-post-method-allowing/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    // Routes from external_routing.json
    describe('simple external route with requirement attributes only', () => {
        it('returns status code 200', (done) => {
            request.get(getAbsoluteURL('/external-route-simple/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns JSON', (done) => {
            request.get(getAbsoluteURL('/external-route-simple/'), (error, response, body) => {
                expect(JSON.parse(body)).toEqual({
                    data: {}
                });
                done();
            });
        });
    });

    describe('external route with param', () => {
        it('returns status code 200 for matched "val1"', (done) => {
            request.get(getAbsoluteURL('/external-route-with-param/val1/'), (error, response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it('returns "Parameter from URL is \'val1\'"', (done) => {
            request.get(getAbsoluteURL('/external-route-with-param/val1/'), (error, response, body) => {
                expect(body).toBe('Parameter from URL is \'val1\'');
                done();
            });
        });
    });
});
