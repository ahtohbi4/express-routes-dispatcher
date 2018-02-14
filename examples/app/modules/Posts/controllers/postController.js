const commentsModel = require('../../Comments/models/commentsModel');
const postsModel = require('../models/postsModel');

module.exports = (request, response) => {
    const { params: { id } } = request;
    const post = postsModel.getPostById(id);

    if (!post) {
        response.status(404);
    }

    return {
        data: {
            comments: commentsModel.getByPostId(id),
            post,
        },
    };
};
