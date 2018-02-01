module.exports = {
    main: {
        path: '/',
        defaults: {
            _format: 'html',
            _template: 'views/pages/index.twig',
        },
    },
    users: {
        prefix: '/users',
        resource: 'modules/users/routes.js',
    },
    posts: {
        prefix: '/posts',
        resource: 'modules/posts/routes.js',
    },
};
