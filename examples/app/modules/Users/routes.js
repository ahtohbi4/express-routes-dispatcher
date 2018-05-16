module.exports = {
    users: {
        path: '/',
        controller: 'controllers/usersListController',
        defaults: {
            _template: 'views/pages/users/index.twig',
        },
    },
    users_json: {
        path: '/~json',
        controller: 'controllers/usersListController',
    },
    user: {
        path: '/{id}/',
        controller: 'controllers/userController',
        defaults: {
            _template: 'views/pages/user/index.twig',
        },
        requirements: {
            id: '\\d+',
        },
    },
    user_json: {
        path: '/{id}/~json',
        controller: 'controllers/userController',
        requirements: {
            id: '\\d+',
        },
    },
};
