const posts = require('../../../data/posts.json');
const users = require('../../../data/users.json');

module.exports = () => {
    return {
        data: {
            posts: posts.map((post) => {
                post['author'] = users.find((user) => (post.author === user.id));

                return post;
            }),
        },
    };
};
