import express from 'express';
import fs from 'fs';
import mime from 'mime-types';
import twig from 'twig';
import url from 'url';
import path from 'path';

import Route from './Route';
import Routes from './Routes';

const DEFAULT_OPTIONS = {
    app: express(),

    baseDir: path.resolve(__dirname, '../'),
    publicDir: 'public',
    publicPath: '/',

    debug: false,
    viewsDir: 'views',

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
    constructor(routes, { baseDir = DEFAULT_OPTIONS.baseDir, publicDir = DEFAULT_OPTIONS.publicDir, ...options } = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,

            baseDir: path.resolve(__dirname, '../', baseDir),
            publicDir: path.resolve(__dirname, '../', baseDir, publicDir),
        };

        this.init(routes);
    }

    /**
     * Initialization of Router.
     *
     * @private
     */
    init(routes) {
        const { app, baseDir, debug, publicDir, publicPath, viewsDir } = this.options;

        app.set('views', path.resolve(baseDir, viewsDir));
        app.set('view engine', 'twig');

        this.routes = new Routes(routes, {
            baseDir,
            debug,
        });
        this.routes.walk((route) => {
            const { controller, format, methods, name, template, uri } = route;

            methods.forEach((method) => {
                app[method](uri, (request, response) => {
                    switch (format) {
                        case Route.FORMAT_HTML: {
                            const {
                                hostname: host,
                                originalUrl: url,
                                query,
                                params,
                                path,
                                protocol,
                                subdomains,
                            } = request;

                            response.render(template, ({
                                ...controller(request, response),
                                __route: {
                                    host,
                                    name,
                                    query,
                                    params,
                                    path,
                                    protocol,
                                    subdomains,
                                    url,
                                },
                            }));
                            break;
                        }

                        case Route.FORMAT_JSON:
                        default:
                            response.json(controller(request, response));
                            break;
                    }
                });
            });
        });

        // Static path.
        app.use(publicPath, express.static(publicDir));

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
     * Starts applications server.
     *
     * @param {function} [cb] - Callback function after the application was started.
     *
     * @public
     */
    start(cb) {
        const { app, host, port, protocol } = this.options;

        this.server = app.listen(port, () => {
            if (cb) {
                cb.call(this, { host, port, protocol });
            }
        });
    }

    /**
     * Stops applications server.
     *
     * @param {function} [cb] - Callback function after the application was stoped.
     *
     * @public
     */
    close(cb) {
        const { app, host, port, protocol } = this.options;

        if (this.server && typeof this.server.close === 'function') {
            this.server.close(() => {
                if (cb) {
                    cb.call(this, { host, port, protocol });
                }
            });
        }
    }
}
