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
