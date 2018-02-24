module.exports = {
    main: {
        baseDir: __dirname,
        defaults: {
            _format: 'html',
            _template: 'pages/index.twig',
        },
        methods: ['get', 'post'],
        requirements: {},
        path: '/',
        name: 'main',
    },
    path: {
        baseDir: __dirname,
        defaults: {
            _template: 'pages/path.twig',
        },
        methods: ['get', 'post'],
        requirements: {},
        path: '/path/',
        name: 'path',
    },
    route: {
        baseDir: __dirname,
        defaults: {
            _template: 'pages/route.twig',
            key2: 'baz',
        },
        methods: ['get', 'post'],
        requirements: {
            key1: '[a-z]{1,3}',
            key2: '[a-z]{1,3}',
        },
        path: '/route/{key1}/{key2}/',
        name: 'route',
    },
    __routes__: {
        baseDir: __dirname,
        defaults: {},
        methods: ['get', 'post'],
        requirements: {},
        name: '__routes__',
        path: '/__routes__/',
    },
};
