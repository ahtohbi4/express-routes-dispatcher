module.exports = {
    main: {
        path: '/',
        defaults: {
            _format: 'html',
            _template: 'pages/index.twig',
        },
    },
    users: {
        prefix: '/users',
        resource: './users/routes.js',
    },
    posts: {
        prefix: '/posts',
        resource: './posts/routes.js',
    },
};
