var request = require('request');
var url = require('url');

var express = require('express'),
    app = express();

var HOST = 'localhost',
    PORT = 1337;

var router = require('../lib/index.js');
router(app, {
    host: 'example.com',
    port: PORT,
    baseDir: __dirname,
    file: 'routing.json'
});

var server = app.listen(PORT, function (){
    console.log('Express server listening on port ' + PORT);
});

describe('checking Status Code of response', function () {
    describe('GET non-existent page', function () {
        it('returns status code 404', function (done) {
            request.get(url.format({
                protocol: 'http',
                hostname: HOST,
                port: PORT
            }), function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    }
}

server.close();

// var base_url = 'http://localhost:1337/'

// describe('Hello World Server', function() {
//   describe('GET /', function() {
//     it('returns status code 200', function(done) {
//       request.get(base_url, function(error, response, body) {
//         expect(response.statusCode).toBe(200);
//         done();
//       });
//     });

//     it('returns Hello World', function(done) {
//       request.get(base_url, function(error, response, body) {
//         expect(body).toBe('Hello World');
//         done();
//       });
//     });
//   });
// });
