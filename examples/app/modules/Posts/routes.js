module.exports = {
    posts: {
        path: '/',
        controller: 'controllers/postsListController',
        defaults: {
            _template: 'views/pages/posts/index.twig',
        },
    },
    posts_json: {
        path: '/~json',
        controller: 'controllers/postsListController',
    },
    post: {
        path: '/{id}/',
        controller: 'controllers/postController',
        defaults: {
            _template: 'views/pages/post/index.twig',
        },
        requirements: {
            id: '\\d+',
        },
    },
    post_json: {
        path: '/{id}/~json',
        controller: 'controllers/postController',
        requirements: {
            id: '\\d+',
        },
    },
};
