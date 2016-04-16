var fs = require('fs');
var path = require('path');
var url = require('url');
var _ = require('lodash');

/**
 * @class Router
 */
var Router = function () {
    var _this = this;

    /**
     * @constructs
     * @param {Express} app
     * @param {object} options
     * @param {string} options.file
     * @param {string} [options.baseDir=__dirname]
     * @throws Error if parameter app is not defined
     * @throws Error if parameter app is not express() function
     * @throws Error if parameter file is not defined
     */
    return function (app, options) {
        if (app === undefined) {
            throw new Error('Could not apply router to undefined application.');
        } else if (typeof app !== 'function') {
            throw new Error('Application should to be an express() function.');
        } else {
            // @member {function} app
            _this.app = app;
        }

        if (options.file === undefined) {
            throw new Error('Route\'s file have to be specified.');
        } else {
            // @member {string} file
            _this.file = options.file;
        }

        // @member {string} [protocol]
        _this.protocol = options.protocol || 'http';

        // @member {string} [host]
        _this.host = options.host || '';

        // @member {string} [port]
        _this.port = options.port || '';

        // @member {string} [baseDir=__dirname]
        _this.baseDir = options.baseDir || __dirname;

        _this._start();
    };
};

/**
 * @method
 * @private
 */
Router.prototype._start = function() {
    var _this = this;

    this.routeMap = {};
    this._normalizeRoutesMap(this._getRoutesFromFile(this.file));

    for (var name in this.routeMap) {
        this._applyRoute(this.routeMap[name]);
    }

    // URI to output routeMap for developing
    // @todo: hide from production mode
    this.app.get('/_dev/routes/', function (req, res) {
        res.json(_this.routeMap);
    });

    this.app.use(function (req, res) {
        _this.sendNotFaund(req, res);
    });
};

/**
 * @method
 * @param {object} routes
 * @param {string} [prefix]
 * @param {object} [defaults]
 * @param {object} [requirements]
 * @returns {Router}
 * @private
 */
Router.prototype._normalizeRoutesMap = function (routes, prefix, defaults, requirements) {
    var prefix = prefix || '',
        defaults = defaults || {},
        requirements = requirements || {};

    for (var name in routes) {
        var route = routes[name],
            routeDefaults = _.merge({}, defaults, (route.defaults || {})),
            routeRequirements = _.merge({}, requirements, (route.requirements || {}));

        if (route.resource !== undefined) {
            this._normalizeRoutesMap(this._getRoutesFromFile(route.resource), (prefix + (route.prefix || '')), routeDefaults, routeRequirements);
        } else {
            this.routeMap[name] = _.merge({}, route, {
                name: name,
                path: prefix + route.path,
                methods: route.methods || ['all'],
                defaults: routeDefaults,
                requirements: routeRequirements
            });
        }
    }

    return this;
};

/**
 * @method
 * @param {string} file
 * @returns {json}
 * @private
 */
Router.prototype._getRoutesFromFile = function (file) {
    return JSON.parse(fs.readFileSync(path.join(this.baseDir, file), 'utf8'));
}

/**
 * @method
 * @param {object} route
 * @returns {Router}
 * @private
 */
Router.prototype._applyRoute = function(route) {
    var _this = this,
        methods = this.getMethods(route);

    methods.forEach(function (method) {
        _this.app[method](_this._getPath(route), function(req, res) {
            res.render(_this.getTemplate(route), _this.getController(route)(req, res, _this));
        });
    });

    return this;
};

/**
 * @const {RegExp}
 */
Router.prototype.PARAM_PATTERN = /\{([^}]+)\}/g;

/**
 * @method
 * @param {object} route
 * @returns {string}
 * @private
 */
Router.prototype._getPath = function(route) {
    var result,
        path = route.path || '';

    result = path.replace(this.PARAM_PATTERN, function (match, name) {
        var pattern = (route.requirements[name] !== undefined) ? '(' + route.requirements[name] + ')' : '';

        return ':' + name + pattern;
    });

    return result;
};

/**
 * @method
 * @param {object} route
 * @returns {array}
 * @public
 */
Router.prototype.getMethods = function(route) {
    var result,
        methods = route.methods || ['all'];

    if (!Array.isArray(methods)) {
        result = [methods];
    } else {
        result = methods;
    }

    return result;
};

/**
 * @method
 * @param {object} router
 * @throws Error if controller for route could not be loaded
 * @returns {function}
 * @public
 */
Router.prototype.getController = function(route) {
    // @todo: this method should be refactored
    var result,
        controller = route.defaults._controller || '';
        controllerPath = path.join(this.baseDir, controller);

    var foo = fs.statSync(controllerPath, function(error, stat) {
        if (error !== null) {
            throw new Error('Could not load controller "' + controller + '" for route "' + route.name + '".');
        }
    });

    if (foo.isFile()) {
        result = require(controllerPath);
    } else {
        throw new Error('Could not load controller "' + controller + '" for route "' + route.name + '".');
    }

    return result;
};

/**
 * @const {object}
 * @see: https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_MIME-%D1%82%D0%B8%D0%BF%D0%BE%D0%B2
 */
Router.prototype.FORMATS = {
    css: 'text/css',
    csv: 'text/csv',
    html: 'text/html',
    text: 'text/plain',
    xml: 'text/xml',
    javascript: 'application/javascript',
    json: 'application/json'
};

/**
 * @method
 * @param {object} router
 * @returns {string}
 * @public
 */
Router.prototype.getFormat = function(route) {
    var result;

    if (route.defaults._format !== undefined && this.FORMATS.hasOwnProperty(route.defaults._format)) {
        result = route.defaults._format;
    } else if (!this.getTemplate(route)) {
        result = 'html';
    } else {
        result = 'json';
    }

    return result;
};

/**
 * @method
 * @param {object} router
 * @returns {string}
 * @public
 */
Router.prototype.getTemplate = function(route) {
    var result;

    if (route.defaults._template === undefined) {
        // @todo: Replace this to link to the static page
        result = path.join(this.baseDir, 'app/modules/Default/views/default.html.twig');
    } else {
        result = route.defaults._template;
    }

    return result;
};

/**
 * @method
 * @param {object} req
 * @param {object} res
 * @returns {Router}
 * @public
 */
Router.prototype.sendNotFaund = function(req, res) {
    res.status(404);
    res.send({
        error: 'Not found'
    });

    return this;
};

/**
 * @method
 * @param {object} req
 * @param {object} res
 * @returns {Router}
 * @public
 */
Router.prototype.sendMethodNotAllowed = function(req, res) {
    res.status(405);
    res.send({
        error: 'Method Not Allowed'
    });

    return this;
};

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
Router.prototype.generate = function(routeName, attributes, suffix) {
    var result;

    if (!this.routeMap.hasOwnProperty(routeName)) {
        throw new Error('Route name ' + routeName + ' is undefined.');
    }

    attributes = attributes || {};

    if (typeof attributes !== 'object') {
        throw new Error('Attributes should to be an Object.');
    }

    var protocol,
        host,
        port;

    if (attributes.hasOwnProperty('_protocol') || attributes.hasOwnProperty('_host') || attributes.hasOwnProperty('_port') || attributes.hasOwnProperty('_absolute')) {
        protocol = attributes['_protocol'] || this.protocol;
        host = attributes['_host'] || this.host;
        port = attributes['_port'] || this.port || '';

        attributes = _.omit(attributes, function (value, attr) {
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

    var route = this.routeMap[routeName];

    result = url.format({
        protocol: protocol,
        hostname: host,
        port: port,
        pathname: route.path.replace(this.PARAM_PATTERN, function (match, name) {
            var requirements = new RegExp(route.requirements[name] || '.*');

            if (attributes.hasOwnProperty(name)) {
                if (requirements.test(attributes[name])) {
                    var value = attributes[name];
                    attributes = _.omit(attributes, name);

                    return value;
                } else {
                    throw new Error('Parameter "' + name + '" is not valid. See requirements of route "' + routeName + '".');
                }
            } else if (route.defaults.hasOwnProperty(name)) {
                if (requirements.test(route.defaults[name])) {
                    return route.defaults[name];
                } else {
                    throw new Error('Default parameter "' + name + '" is not valid. See requirements of route "' + routeName + '".');
                }
            } else {
                throw new Error('Parameter "' + name + '" is not defined for route "' + routeName + '".');
            }
        }),
        query: attributes,
        hash: suffix
    });

    return result;
};

module.exports = new Router();
