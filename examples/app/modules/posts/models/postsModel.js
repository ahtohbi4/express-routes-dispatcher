const posts = require('../../../../data/posts.json');

const commentsModel = require('../../Comments/models/commentsModel');
const usersModel = require('../../Users/models/usersModel');

class Posts {
    constructor(data) {
        this.data = data;
    }

    get() {
        return this.data.map((post) => Object.assign({}, post, {
            author: usersModel.getUserById(post.author),
            comments: commentsModel.getNumberByPostId(post.id),
        }));
    }

    getPostById(id) {
        return this.get().find(({ id: postId }) => (postId === id));
    }

    getPostsByAuthor(author, limit) {
        const result = this.get().filter((post) => (post.author.id === author));

        if (limit) {
            return result.slice(0, limit);
        }

        return result;
    }
}

module.exports = new Posts(posts);
