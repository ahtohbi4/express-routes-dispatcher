const users = require('../../../data/users.json');

module.exports = (request, response) => {
    const { params: { id } } = request;
    const user = users.find((user) => (user.id === id));

    if (!user) {
        response.status(404);
    }

    return {
        data: {
            user,
        },
    };
};
