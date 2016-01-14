var http = require('http');

/**
 * Object Node.js Server
 * @return {Server}
 */
function Server() {
    this.port = 1337;

    this.server = http.createServer(function (req, res) {
        file.serve(req, res);
    });

    return this;
}

/**
 * @method start
 * @return {Server}
 */
Server.prototype.start = function () {
    this.server.listen(this.port);

    console.log('Server running on port ' + this.port);

    return this;
};

/**
 * @method stop
 * @return {Server}
 */
Server.prototype.stop = function () {
    this.server.close();

    console.log('Server was stopped');

    return this;
};

module.exports = new Server();
