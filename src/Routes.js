import fs from 'fs';
import path from 'path';
import url from 'url';

import Route from './Route';

import { joinURI } from './utils';

export default class Routes {
    constructor(routes, options = {}) {
        this.options = options;

        this.init(routes);
    }

    init(routes) {
        const { baseDir, debug } = this.options;

        this.routes = Routes.normalize(routes, baseDir);

        if (debug) {
            this.routes['__routes__'] = new Route({
                controller: (request, response) => {
                    response.json(this.routes);
                },
                name: '__routes__',
                path: '/__routes__/',
            });
        }
    }

    getByName(name) {
        return this.routes[name];
    }

    walk(cb) {
        const { routes } = this;

        return Object.keys(routes)
            .forEach((name) => cb.call(this, routes[name], name));
    }
}

Routes.normalize = (routes, baseDir = '', basePrefix = '') => {
    switch (typeof routes) {
        case 'object':
            return Object.keys(routes)
                .reduce((result, name) => {
                    const route = routes[name];
                    const { prefix, resource } = route;

                    if (resource) {
                        const subRoutes = require(path.resolve(baseDir, resource));

                        return {
                            ...result,
                            ...Routes.normalize(
                                subRoutes,
                                path.resolve(baseDir, path.dirname(resource),),
                                joinURI(basePrefix, prefix),
                            ),
                        };
                    }

                    return {
                        ...result,
                        [name]: new Route({
                            ...route,
                            baseDir,
                            name,
                            path: joinURI(basePrefix, route.path),
                        }),
                    };
                }, {});

        default:
            throw new TypeError('Unexpected type of routes.');
    }
};
