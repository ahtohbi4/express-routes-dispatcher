const url = require('url');

/**
 * URL formatter
 *
 * @param {string} [protocol='http'] - The protocol
 * @param {string} [host='localhost'] - The host
 * @param {string} [port] - The port
 * @returns {function}
 */
module.exports = function (protocol, host, port) {
    protocol = protocol || 'http';
    host = host || 'localhost';
    port = port || null;

    return (pathname) => {
        pathname = pathname || '';

        return url.format({
            protocol: protocol,
            hostname: host,
            port: port,
            pathname: pathname
        });
    };
};
