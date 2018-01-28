import express from 'express';
import fs from 'fs';
import mime from 'mime-types';
import twig from 'twig';
import url from 'url';
import path from 'path';

import Route from './Route';
import Routes from './Routes';

import { noop } from './utils';

const DEFAULT_OPTIONS = {
    app: express(),

    baseDir: __dirname,
    debug: false,
    views: 'views',

    host: 'localhost',
    port: '3000',
    protocol: 'http',
};

const URI_ROUTES = '/__routes/';

export default class Router {
    /**
     * @constructs
     *
     * @param {Object|string} routes
     *
     * @param {Object} [options]
     *
     * @param {string} [options.app]
     *
     * @param {string} [options.baseDir=__dirname]
     * @param {string} [options.debug=false]
     *
     * @param {string} [options.host=localhost]
     * @param {string} [options.port=3000]
     * @param {string} [options.protocol=http]
     */
    constructor(routes, options = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,

            baseDir: path.resolve(__dirname, '../', options.baseDir),
        };

        this.init(routes);
    }

    /**
     * Initialization of Router.
     *
     * @private
     */
    init(routes) {
        const { app, baseDir, debug, views } = this.options;

        app.set('views', path.resolve(baseDir, views));
        app.set('view engine', 'twig');

        this.routes = new Routes(routes, {
            baseDir,
            debug,
        });
        this.routes.walk((route) => {
            const { controller, format, methods, template, uri } = route;

            methods.forEach((method) => {
                app[method](uri, (request, response) => {
                    switch (format) {
                        case Route.FORMAT_HTML:
                            response.render(template, controller(request, response));
                            break;

                        case Route.FORMAT_JSON:
                        default:
                            response.send(controller(request, response));
                            break;
                    }
                });
            });
        });

        // Page not found.
        app.use((request, response) => {
            response.status(404);
            response.send({
                error: 'Not found',
            });    
        });

        twig.extendFunction(
            'path',
            (name, params) => this.routes
                .getByName(name)
                .generateURI(params),
        );
    }

    /**
     * Normalizes routes map to a plain object.
     *
     * @param {string|Object} routes - Route declaration.
     * @param {string} [base] - Base of URI path.
     *
     * @private
     */
    normalizeRoutesMap(routes, base = '') {
        const { baseDir } = this.options;

        switch (typeof routes) {
            case 'object':
                return Object.keys(routes)
                    .reduce((result, name) => {
                        const route = routes[name];
                        const { children, prefix } = route;

                        if (children) {
                            return {
                                ...result,
                                ...this.normalizeRoutesMap(children, Router.resolvePath(base, prefix)),
                            };
                        }

                        return {
                            ...result,
                            [name]: new Route({
                                ...route,
                                name,
                                path: Router.resolvePath(base, route.path),
                            }),
                        };
                    }, {});

            case 'string':
                return this.normalizeRoutesMap(JSON.parse(fs.readFileSync(join(baseDir, routes), 'utf8')));

            default:
                throw new TypeError('Unexpected type of routes.');
        }
    }

    /**
     * Starts an application.
     *
     * @param {function} [cb] - Callback function after the application was started.
     *
     * @public
     */
    start(cb = noop) {
        const { host, port, protocol } = this.options;

        this.options.app
            .listen(port, () => {
                console.log(`Start Router on ${protocol}://${host}:${port}`);

                cb.call(this);
            });
    }
}

Router.resolvePath = (...items) => items
    .filter((item) => item)
    .join('/')
    .replace(/\/{2,}/g, '/');








class Foo {
    /**
     * @method
     * @private
     */
    init() {
        const { debug } = this.options;

        this.routeMap = {};
        this._normalizeRoutesMap(this._getRoutesFromFile(this.file));

        for (let name in this.routeMap) {
            this._applyRoute(this.routeMap[name]);
        }

        if (debug) {
            // URI to output routeMap for developing
            this.app.get(URI_ROUTES, (req, res) => {
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
                Object.assign(this.routeMap[name] = {}, route, {
                    name: name,
                    path: prefix + route.path,
                    methods: route.methods || ['all'],
                    defaults: routeDefaults,
                    requirements: routeRequirements
                });
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
                let formats = {};
                this._getFormatsAvailable(route).map((format) => {
                    formats[format] = () => {
                        res.type(format);

                        if (this._getFormat(route) === 'json' || this._getTemplate(route) === undefined) {
                            res.send(this._getController(route)(req, res, this));
                        } else {
                            res.render(this._getTemplate(route), this._getController(route)(req, res, this));
                        }
                    };
                }); //res.json(this._getFormatsAvailable(route));

                res.format(formats);
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

        if (route.defaults.hasOwnProperty('_format') && mime.lookup(route.defaults._format)) {
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
     * @returns {array}
     * @private
     */
    _getFormatsAvailable(route) {
        let result = [];

        result.push(this._getFormat(route));

        if (route.requirements._format !== undefined) {
            result.push(route.requirements._format.split('|'));
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
}
