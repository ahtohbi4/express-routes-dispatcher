var express = require('express'),
    app = express();

var PORT = 1337;

var request = require('request');

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
