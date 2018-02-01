const postsModel = require('../../posts/models/postsModel');
const usersModel = require('../models/usersModel');

module.exports = (request, response) => {
    const { params: { id } } = request;
    const user = usersModel.getUserById(id);

    if (!user) {
        response.status(404);
        response.end();

        return null;
    }

    return {
        data: {
            user: Object.assign({}, user, {
                posts: postsModel.getPostByAuthor(id),
            }),
        },
    };
};
