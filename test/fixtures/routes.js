module.exports = {
    main: {
        path: '/',
        defaults: {
            _format: 'html',
            _template: 'pages/index.twig',
        },
    },
    path: {
        path: '/path/',
        defaults: {
            _template: 'pages/path.twig',
        },
    },
    route: {
        path: '/route/{key1}/{key2}/',
        defaults: {
            _template: 'pages/route.twig',
            key2: 'baz',
        },
        requirements: {
            key1: '[a-z]{1,3}',
            key2: '[a-z]{1,3}',
        },
    },
    withRender: {
        path: '/with-render/',
        defaults: {
            _template: 'pages/with-render.twig',
        },
    },
};
