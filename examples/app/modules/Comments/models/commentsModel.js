const comments = require('../../../../data/comments.json');

const usersModel = require('../../Users/models/usersModel');

const Comments = function (data) {
    this.data = data;
}

Comments.prototype.get = function () {
    return this.data.map((comment) => Object.assign({}, comment, {
        author: usersModel.getUserById(comment.author),
    }));
};

Comments.prototype.getById = function (id) {
    return this.get().find(({ id: commentId }) => (commentId === id));
};

Comments.prototype.getByPostId = function (postId) {
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
};

Comments.prototype.getNumberByPostId = function (postId) {
    return this.getByPostId(postId).length;
};

module.exports = new Comments(comments);
