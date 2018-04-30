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
        resource: 'modules/Users/routes.js',
    },
    posts: {
        prefix: '/posts',
        resource: 'modules/Posts/routes.js',
    },
    search: {
        path: '/search/',
        methods: [
            'post',
        ],
        controller: 'modules/Search/controllers/searchController',
        defaults: {
            _format: 'html',
            _template: 'views/pages/search/index.twig',
        },
    },
};
