const posts = require('../models/posts');

module.exports = () => {
    return {
        data: {
            posts: posts.get(),
        },
    };
};
