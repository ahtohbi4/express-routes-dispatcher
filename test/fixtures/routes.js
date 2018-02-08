module.exports = {
    main: {
        path: '/',
        defaults: {
            _format: 'html',
            _template: 'pages/index.twig',
        },
    },
    route: {
        path: '/route/{key1}/{key2}/',
        defaults: {
            _template: 'pages/route.twig',
        },
    },
};
