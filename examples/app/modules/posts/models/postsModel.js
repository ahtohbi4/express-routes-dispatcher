const posts = require('../../../../data/posts.json');

const commentsModel = require('../../Comments/models/commentsModel');
const usersModel = require('../../Users/models/usersModel');

const Posts = function (data) {
    this.data = data;
};

Posts.prototype.get = function () {
    return this.data.map((post) => Object.assign({}, post, {
        author: usersModel.getUserById(post.author),
        comments: commentsModel.getNumberByPostId(post.id),
    }));
};

Posts.prototype.getPostById = function (id) {
    return this.get().find(({ id: postId }) => (postId === id));
};

Posts.prototype.getPostsByAuthor = function (author, limit) {
    const result = this.get().filter((post) => (post.author.id === author));

    if (limit) {
        return result.slice(0, limit);
    }

    return result;
};

module.exports = new Posts(posts);
