module.exports = {
    posts: {
        path: '/',
        controller: 'controllers/getPosts',
        defaults: {
            _template: 'views/pages/posts/index.twig',
        },
    },
    posts_json: {
        path: '/~json',
        controller: 'controllers/getPosts',
    },
};
