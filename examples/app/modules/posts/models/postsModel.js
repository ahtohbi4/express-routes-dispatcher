const posts = require('../../../../data/posts.json');
const usersModel = require('../../users/models/usersModel');

const Posts = function (data) {
    this.data = data;
}

Posts.prototype.get = function () {
    return this.data.map((post) => Object.assign({}, post, {
        author: usersModel.getUserById(post.author),
    }));
};

Posts.prototype.getPostByAuthor = function (author, limit) {
    const result = this.data.filter((post) => (post.author === author));

    if (limit) {
        return result.slice(0, limit);
    }

    return result;
};

module.exports = new Posts(posts);
