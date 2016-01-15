var HOST = 'localhost',
    PORT = 1337;

var request = require('request');
var url = require('url');
var express = require('express'),
    app = express();

var router = require('../lib/index.js');
router(app, {
    host: HOST,
    port: PORT,
    baseDir: __dirname,
    file: './routing/main_routing.json'
});

/**
 * @method getAbsoluteURL
 * @param {String} path
 * @return {String} Absolute URI to path
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
    beforeEach(function () {
        this.server = app.listen(PORT, function () {
            console.log('Express server listening on port ' + PORT);
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

    afterEach(function () {
        this.server.close();
    });
});
