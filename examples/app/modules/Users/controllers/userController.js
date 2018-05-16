const postsModel = require('../../Posts/models/postsModel');
const usersModel = require('../models/usersModel');

module.exports = (request, response) => {
    const { params: { id } } = request;
    const user = usersModel.getUserById(id);

    if (!user) {
        response.status(404);
    }

    return {
        data: {
            posts: postsModel.getPostsByAuthor(id),
            user,
        },
    };
};
