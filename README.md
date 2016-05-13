Routing based on JSON
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

> MVC Routing based on JSON for [Express](http://expressjs.com/).

In this implementation the routing is based on JSON format, which is a map from a URL path to a controller (Controller) to processes the request and finally to a template (View) to visualize a response.

Format is similar to syntax of [Symfony](https://symfony.com/doc/3.0/book/routing.html) YAML based Routing.

Installation
--

```bash
$ npm install express-routes-dispatcher --save
```

Usage
--

The module which allows to organize simple and clear MVC-architecture in your Node.js application.

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

Entry point is the `app.js`. All HTTP-requests server sends to it, and it, in turn, forwards them to the controllers.

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
// app/config/routes.json
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

The controller is a ordinary JavaScript module ([Express.js middleware](http://expressjs.com/en/guide/using-middleware.html)), with two optional parameters `request` and` response`:

```javascript
module.exports = function (request, response) {
    return {
        data: {}
    };
};
```

Also it is possible to design separate modules, which in turn can be used in your other applications. For example, use them as Git's submodules and connect external routes of this module into their applications.

Example of file `routes.json` of a project that uses a News module with its own routes:

```json
// app/config/routes.json
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

```json
// modules/News/config/routing.json
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

_Comming soon…_

Tests
--

```bash
$ npm install
$ npm test
```

License
--

MIT © Alexander Antonov <alexandr-post@yandex.ru>
