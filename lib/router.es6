'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime-types');
const _ = require('lodash');

/**
 * @class Router
 */
class Router {
    /**
     * @constructs
     * @param {Express} app
     * @throws Error if parameter app is not defined
     * @throws Error if parameter app is not express() function
     * @param {object} options
     * @param {string} options.file
     * @throws Error if parameter file is not defined
     * @param {string} [options.baseDir=__dirname]
     * @param {string} [options.debug=false]
     */
    constructor() {
        return (app, options) => {
            if (app === undefined) {
                throw new Error(`Could not apply router to undefined application.`);
            } else if (typeof app !== 'function') {
                throw new Error(`Application should to be an express() function.`);
            } else {
                // @member {function} app
                this.app = app;
            }

            if (options.file === undefined) {
                throw new Error(`Route's file have to be specified.`);
            } else {
                // @member {string} file
                this.file = options.file;
            }

            // @member {string} [protocol]
            this.protocol = options.protocol || 'http';

            // @member {string} [host]
            this.host = options.host || '';

            // @member {string} [port]
            this.port = options.port || '';

            // @member {string} [baseDir=__dirname]
            this.baseDir = options.baseDir || __dirname;

            // @member {boolean} [debug=false]
            this.debug = options.debug || false;

            this._start();
        };
    }

    /**
     * @method
     * @private
     */
    _start() {
        this.routeMap = {};
        this._normalizeRoutesMap(this._getRoutesFromFile(this.file));

        for (let name in this.routeMap) {
            this._applyRoute(this.routeMap[name]);
        }

        if (this.debug) {
            // URI to output routeMap for developing
            this.app.get('/_dev/routes/', (req, res) => {
                res.json(this.routeMap);
            });
        }

        this.app.use((req, res) => {
            this.sendNotFaund(req, res);
        });
    }

    /**
     * @method
     * @param {object} routes
     * @param {string} [prefix]
     * @param {object} [defaults]
     * @param {object} [requirements]
     * @returns {Router}
     * @private
     */
    _normalizeRoutesMap(routes, prefix, defaults, requirements) {
        prefix = prefix || '';
        defaults = defaults || {};
        requirements = requirements || {};

        for (let name in routes) {
            let route = routes[name];
            let routeDefaults = {};
            let routeRequirements = {};

            Object.assign(routeDefaults, defaults, (route.defaults || {}));
            Object.assign(routeRequirements, requirements, (route.requirements || {}));

            if (route.resource !== undefined) {
                this._normalizeRoutesMap(this._getRoutesFromFile(route.resource), (prefix + (route.prefix || '')), routeDefaults, routeRequirements);
            } else {
                Object.assign(this.routeMap[name] = {}, {
                    name: name,
                    path: prefix + route.path,
                    methods: route.methods || ['all'],
                    defaults: routeDefaults,
                    requirements: routeRequirements
                }, route);
            }
        }

        return this;
    }

    /**
     * @method
     * @param {string} file
     * @returns {json}
     * @private
     */
    _getRoutesFromFile(file) {
        let result;

        try {
            result = JSON.parse(fs.readFileSync(path.join(this.baseDir, file), 'utf8'));
        } catch (e) {
            throw new Error(e);
        }

        return result;
    }

    /**
     * @method
     * @param {object} route
     * @returns {Router}
     * @private
     */
    _applyRoute(route) {
        let methods = this._getMethods(route);

        methods.forEach((method) => {
            this.app[method](this._getPath(route), (req, res) => {
                if (this._getTemplate(route)) {
                    res.render(this._getTemplate(route), this._getController(route)(req, res, this));
                } else {
                    res.send(this._getController(route)(req, res, this));
                }
            });
        });

        return this;
    }

    /**
     * @const {RegExp}
     */
    get PARAM_PATTERN() {
        return /\{([^}]+)\}/g;
    }

    /**
     * @method
     * @param {object} route
     * @returns {string}
     * @private
     */
    _getPath(route) {
        let result;

        result = route.path.replace(this.PARAM_PATTERN, (match, name) => {
            let pattern = (typeof route.requirements[name] !== 'undefined') ? `(${route.requirements[name]})` : '';

            return `:${name}${pattern}`;
        });

        return result;
    }

    /**
     * @method
     * @param {object} route
     * @returns {array}
     * @private
     */
    _getMethods(route) {
        let result;
        let methods = route.methods || ['all'];

        if (!Array.isArray(methods)) {
            result = [methods];
        } else {
            result = methods;
        }

        result = result.map((method) => {
            return method.toLowerCase();
        });

        return result;
    }

    /**
     * @method
     * @param {object} router
     * @throws Error if controller for route could not be loaded
     * @returns {function}
     * @private
     */
    _getController(route) {
        let result;
        let controller = route.defaults._controller || '';
        let controllerPath = path.join(this.baseDir, controller);

        try {
            result = require(controllerPath);
        } catch (e) {
            throw new Error(`Could not load controller "${controller}" for route "${route.name}".`);
        }

        return result;
    }

    /**
     * @method
     * @param {object} router
     * @returns {string}
     * @private
     */
    _getFormat(route) {
        let result;
        let template = this._getTemplate(route);

        if (route.defaults.hasOwnProperty(_format) && mime.lookup(this.defaults._format)) {
            if (typeof template !== 'undefined') {
                result = route.defaults._format;
            } else {
                throw new Error(`Template for route "${route.name}" is not defined.`)
            }
        } else if (typeof template !== 'undefined') {
            result = 'html';
        } else {
            result = 'json';
        }

        return result;
    }

    /**
     * @method
     * @param {object} router
     * @returns {string}
     * @private
     */
    _getTemplate(route) {
        let result;

        result = route.defaults._template;

        return result;
    }

    /**
     * @method
     * @param {object} req
     * @param {object} res
     * @returns {Router}
     * @public
     */
    sendNotFaund(req, res) {
        res.status(404);
        res.send({
            error: 'Not found'
        });

        return this;
    }

    /**
     * @method
     * @param {object} req
     * @param {object} res
     * @returns {Router}
     * @public
     */
    sendMethodNotAllowed(req, res) {
        res.status(405);
        res.send({
            error: 'Method Not Allowed'
        });

        return this;
    }

    /**
     * @method
     * @param {string} routeName
     * @param {object} [attributes]
     * @param {suffix} [suffix]
     * @throws Error if route is not defined
     * @throws Error if parameter attributes is not an Object
     * @throws Error if parameter suffix is not a String
     * @returns {string}
     * @public
     */
    generate(routeName, attributes, suffix) {
        let result;

        if (!this.routeMap.hasOwnProperty(routeName)) {
            throw new Error(`Route name "${routeName}" is undefined.`);
        }

        attributes = attributes || {};

        if (typeof attributes !== 'object') {
            throw new Error(`Attributes should to be an Object.`);
        }

        let protocol;
        let host;
        let port;

        if (attributes.hasOwnProperty('_protocol') || attributes.hasOwnProperty('_host') || attributes.hasOwnProperty('_port') || attributes.hasOwnProperty('_absolute')) {
            protocol = attributes['_protocol'] || this.protocol;
            host = attributes['_host'] || this.host;
            port = attributes['_port'] || this.port || '';

            attributes = _.omit(attributes, (value, attr) => {
                if ([
                    '_protocol',
                    '_host',
                    '_port',
                    '_absolute'
                ].indexOf(attr) != -1) {
                    return attr;
                }
            });
        }

        suffix = suffix || '';

        if (typeof suffix !== 'string') {
            throw new Error('Suffix should to be a String.');
        }

        let route = this.routeMap[routeName];

        result = url.format({
            protocol: protocol,
            hostname: host,
            port: port,
            pathname: route.path.replace(this.PARAM_PATTERN, (match, name) => {
                let requirements = new RegExp(route.requirements[name] || '.*');

                if (attributes.hasOwnProperty(name)) {
                    if (requirements.test(attributes[name])) {
                        let value = attributes[name];
                        attributes = _.omit(attributes, name);

                        return value;
                    } else {
                        throw new Error(`Parameter "${name}" is not valid. See requirements of route "${routeName}".`);
                    }
                } else if (route.defaults.hasOwnProperty(name)) {
                    if (requirements.test(route.defaults[name])) {
                        return route.defaults[name];
                    } else {
                        throw new Error(`Default parameter "${name}" is not valid. See requirements of route "${routeName}".`);
                    }
                } else {
                    throw new Error(`Parameter "${name}" is not defined for route "${routeName}".`);
                }
            }),
            query: attributes,
            hash: suffix
        });

        return result;
    }
};

module.exports = new Router();
