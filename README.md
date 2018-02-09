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

Or

```bash
$ yarn add express-routes-dispatcher
```

Usage
--

The module which allows organizing simple and clear MVC-architecture in your Node.js application.

For example, there are a page with list of articles `/articles/` and pages with one article (for example, `/articles/some-aticle-page/`). In this case, application architecture might look like:

```
app/
    app.js
    config/
        routes.json
    modules/
        Article/
            controllers/
                item.js
                list.js
            models/
                …
            views/
                item.html.twig
                list.html.twig
```

The entry point is the `app.js`. All HTTP-requests server sends to it, and it, in turn, forwards them to the controllers.

```javascript
// app/app.js

const express = require('express');
const app = express();

const router = require('express-routes-dispatcher');
router(app, {
    file: './config/routes.json'
});
```

File `routes.json` describes the URIs, controllers for processing requests by this URIs and templates to returning response data by the controller:

```json
{
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

Tests
--

```bash
$ npm install
$ npm test
```

License
--

MIT © Alexander Antonov <alexandr-post@yandex.ru>
