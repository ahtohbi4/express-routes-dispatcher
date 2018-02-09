JSON based routing for Node.js
==

[![npm version][version-img]][version] [![Dependency Status][dependency-img]][dependency] [![Travis Build Status][travis-img]][travis] [![Appveyor Build Status][appveyor-img]][appveyor] [![Codacy Badge][codacy-img]][codacy]

[dependency-img]: https://david-dm.org/ahtohbi4/express-routes-dispatcher.svg
[dependency]: https://david-dm.org/ahtohbi4/express-routes-dispatcher
[version-img]: https://badge.fury.io/js/express-routes-dispatcher.svg
[version]: https://badge.fury.io/js/express-routes-dispatcher
[travis-img]: https://travis-ci.org/ahtohbi4/express-routes-dispatcher.svg?branch=master
[travis]: https://travis-ci.org/ahtohbi4/express-routes-dispatcher
[appveyor-img]: https://ci.appveyor.com/api/projects/status/0xodj7np6jghyuik/branch/master?svg=true
[appveyor]: https://ci.appveyor.com/project/ahtohbi4/express-routes-dispatcher/branch/master
[codacy-img]: https://api.codacy.com/project/badge/grade/480c7aa1737046bfa6d475082847d513
[codacy]: https://www.codacy.com/app/alexandr-post/express-routes-dispatcher

> JSON based MVC routing using [express](http://expressjs.com/) and [twig](https://twig.symfony.com/doc/2.x/) as template engine.

In this implementation, the routing is based on JSON format, which is a map from a URL path to a controller (Controller) to processes the request and finally to a template (View) to visualize a response.

The format is similar to the syntax of [Symfony](https://symfony.com/doc/current/routing.html) YAML based Routing.

Installation
--

```bash
$ npm install express-routes-dispatcher --save
```

or

```bash
$ yarn add express-routes-dispatcher
```

Usage
--

The module which allows organizing simple and clear MVC-architecture in your Node.js application.

For example, there are a page with list of articles `/articles/` and pages with one article (for example, `/articles/some-aticle-page/`). In this case, application architecture might look like:

```
app/                          // Application root.
 ├─ modules/                  // Modules.
 │   ├─ articles/
 │   │   ├─ controllers/      // Module`s controllers.
 │   │   ├─ models/           // Module`s models.
 │   │   ├─ views/            // Module`s templates such as pages, partials or blocks (BEM).
 │   │   └─ routing.json      // Module`s routing.
 │   └─ •••
 ├─ views/                    // Common templates such as static pages, partials or blocks (BEM).
 ├─ config.js                 // Config file.
 ├─ index.js                  // The entry point of the application.
 └─ routing.js                // Base routing file. Includes common static pages and routing files of modules.
```

The entry point `index.js` processes all HTTP-requests.

```javascript
// app/index.js

const express = require('express');
const app = express();

const router = require('express-routes-dispatcher');
router(app, {
    file: './config/routes.json'
});
```

File `routes.js` describes the URIs, controllers for processing requests by this URIs and templates to returning response data by the controller:

```javascript
module.exports = {
    "articles_list": {
        "path": "/articles/",
        "defaults": {
            "_controller": "modules/Article/controllers/list.js",
            "_template": "modules/Article/views/list.html.twig"
        }
    },
    "articles_item": {
        "path": "/articles/{alias}/",
        "defaults": {
            "_controller": "modules/Article/controllers/item.js",
            "_template": "modules/Article/views/item.html.twig"
        },
        "requirements": {
            "alias": "[a-zA-z-_0-9]+"
        }
    }
}
```

The controller is a ordinary JavaScript module ([Express.js middleware](http://expressjs.com/en/guide/using-middleware.html)), with two optional parameters `request` and `response`:

```javascript
// modules/Article/controllers/list.js

module.exports = function (request, response) {
    return {
        data: {}
    };
};
```

Also, it is possible to design separate modules, which in turn can be used in your other applications. For example, use them as Git's submodules and connect external routes of this module into their applications.

Example of file `app/config/routes.json` of a project that uses a News module with its own routes:

```json
{
    "welcome_page": {
        "path": "/",
        "defaults": {
            "_controller": "modules/Default/index.js",
            "_template": "app/Resources/views/pages/welcome_page.html.twig"
        }
    },

    "_news": {
        "prefix": "/news",
        "resource": "modules/News/config/routing.json"
    }
}
```

Example of the external `modules/News/config/routing.json`:

```json
{
    "list": {
        "path": "/",
        "defaults": {
            "_controller": "modules/News/controller/list.js",
            "_template": "modules/News/views/list.html.twig"
        }
    }
}
```

Class `Router`
--

#### Constructor `new Router(routes, options)`

Returns instance of Router.

| Parameter | Type | Default | Description |
| --------- | :--: | :-----: | ----------- |
| `routes` | *Object* | — | **Required.** Object with routes description. |
| `options` | *Object* | — | Additional options. |
| `options.baseDir` | *string* | [\_\_dirname](https://nodejs.org/api/globals.html#globals_dirname) | Base directory to resolve relative paths, such as `publicDir`, `viewsDir` and paths of routes from `routes`. |
| `options.publicDir` | *string* | 'public' | |
| `options.publicPath` | *string* | '/' | |
| `options.debug` | *boolean* | false | If `true` the additional route [/\_\_routes\_\_/](http://localhost:3000/__routes__/) with map of all routes in JSON-format is available. |
| `options.viewsDir` | *string* | 'views' | |
| `options.host` | *string* | 'localhost' | |
| `options.port` | *number* | 3000 | |
| `options.protocol` | *string* | 'http' | |

```javascript
const router = new Router(routes, options);
```

#### Method `start(cb)`

Starts and returns instance of Node.js server. Use this instance to stop server.

Function `cb` will be called after successful starting.

```javascript
const server = router.start(({ host, port, protocol }) => {
    console.log(`Server on ${protocol}://${host}:${port} was started.`);
});
```

#### Method `close(cb)`

Stops server.

```javascript
const server = router.start();

setTimeout(() => server.close(), 60000); // The server will be stopped after the 60 seconds.
```

Options
--

To start the router, use function:

```javascript
const router = require('express-routes-dispatcher');
router(app, {
    file: './config/routes.json'
});
```

with to required parameters:

#### app

_Required_

Object of an Express application:

```javascript
// app/app.js

const express = require('express');
const app = express();
```

#### config

_Required_

The configuration of the router. Object with the next properties:

#### file

_Required_

String. Path to a main file of routes.

#### protocol

_Default: 'http'_

_Coming soon…_

#### host

_Coming soon…_

#### port

_Coming soon…_

#### baseDir

_Default: current script's directory_

Base directory with resources, such as controllers or templates.

#### debug

_Default: false_

Set `true` to switch on the debug mode. In this mode by URI `/_dev/routing/` you can watch normalized route's map of your application as single JSON view, comprising all external routes.

The syntax of inline routes
--

#### _\<route name\>_

String. Should be unique, otherwise, a last declared route with the same name will override earlier ones.

#### path

_Required_

#### defaults

_Required as a parent of required parameter `_controller`_

Object. Contains the following options:

#### _controller

_Required_

#### _format

String.

#### _template

String.

#### _\<variable from `path`\>_

String.

#### requirements

Object. Contains the following options:

#### _format

#### _\<variable from `path`\>_

RegExp.

#### methods

String or Array. Allowed methods for requests.

Syntax of external routes
--

#### resource

_Required_

#### prefix

String.

For more details see tests in `spec/`.

Using templates
--

Twig is a powerful template engine. More about it you can read [in official documentation](https://twig.symfony.com/doc/2.x/).

For all templates are available some global variables and functions.

#### `__route` *(Object)*

An object which contains parameters of the current route.

| Parameter | Type | Description |
| --------- | :----: | ----------- |
| `host` | *string* | Hostname. |
| `name` | *string* | Name of the route. You can use it for example to detect a current item of the menu. |
| `params` | *Object* | Object with parameters geted from the URL. |
| `path` | *string* | |
| `protocol` | *('http'\|'https')* | Protocol. |
| `query` | *Object* | Object with GET-parameters from the URL. |
| `subdomains` | *Array<string>* | Array of subdomains. |
| `url` | *string* | |

#### `path(name, options)` *(function)*

Function returns a generated URL by route name.

`name` *(string)*

Required. Name of routing to generate URL.

`options` *(Object)*

Additional options.

| Parameter | Type | Description |
| --------- | :----: | ----------- |
| `hash` | *string* | Fragment, separated from the preceding part by a hash `#`. |
| `params` | *Object* | |
| `query` | *Object* | |

**Example:**

```javascript
/* routes.js */

module.exports = {
    profile: {
        path: '/users/profile/{id}/',
    },
};
```

```twig
{# views/pages/index.twig #}

<a href="{{ path('profile', {
    hash: 'name',
    params: {
        id: '1a2s564ws',
    },
    query: {
        tab: 'info',
    },
}) }}">My profile</a>
```

In a browser you'll see:

```html
<a href="/users/profile/1a2s564ws/?tab=info#info">My profile</a>
```

Tests
--

```bash
$ npm install
$ npm test
```

License
--

MIT © Alexander Antonov <alexandr-post@yandex.ru>
