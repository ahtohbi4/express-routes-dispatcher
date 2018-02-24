const comments = require('../../../../data/comments.json');

const usersModel = require('../../Users/models/usersModel');

class Comments {
    constructor(data) {
        this.data = data;
    }

    get() {
        return this.data.map((comment) => Object.assign({}, comment, {
            author: usersModel.getUserById(comment.author),
        }));
    }

    getById(id) {
        return this.get().find(({ id: commentId }) => (commentId === id));
    }

    getByPostId(postId) {
        return this.get()
            .reduce((result, comment) => {
                if (comment.post !== postId) {
                    return result;
                }

                if (comment.comment) {
                    return result.concat(Object.assign({}, comment, {
                        comment: this.getById(comment.comment),
                    }));
                }

                return result.concat(comment);
            }, []);
    }

    getNumberByPostId(postId) {
        return this.getByPostId(postId).length;
    }
}

module.exports = new Comments(comments);
