const url = require('url');

/**
 * URL formatter
 *
 * @param {string} [protocol='http'] - The protocol
 * @param {string} [hostname='localhost'] - The host
 * @param {string} [port] - The port
 * @returns {function}
 */
module.exports = function (protocol, hostname, port) {
    protocol = protocol || 'http';
    hostname = hostname || 'localhost';
    port = port || null;

    return (pathname) => {
        pathname = pathname || '';

        return url.format({
            protocol,
            hostname,
            port,
            pathname
        });
    };
};
