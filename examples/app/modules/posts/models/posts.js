const posts = require('../../../../data/posts.json');
const users = require('../../users/models/users');

const Posts = function (data) {
    this.data = data.map((post) => {
        post['author'] = users.getUserById(post.author);

        return post;
    });
}

Posts.prototype.get = function () {
    return this.data;
};

module.exports = new Posts(posts);
