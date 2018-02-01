const users = require('../models/users');

module.exports = (request, response) => {
    const { params: { id } } = request;
    const user = users.getUserById(id);

    if (!user) {
        response.status(404);
    }

    return {
        data: {
            user,
        },
    };
};
