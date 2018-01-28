module.exports = {
    users: {
        path: '/',
        controller: 'controllers/getUsers',
        defaults: {
            _template: 'views/pages/users/index.twig',
        },
    },
    users_json: {
        path: '/~json',
        controller: 'controllers/getUsers',
    },
    user: {
        path: '/{id}/',
        controller: 'controllers/getUserById',
        defaults: {
            _template: 'views/pages/user/index.twig',
        },
        requirements: {
            id: '\\d+',
        },
    },
};
