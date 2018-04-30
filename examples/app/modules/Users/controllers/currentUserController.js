const usersModel = require('../models/usersModel');

module.exports = () => {
    const currensUserId = '96947293';

    return {
        data: {
            user: usersModel.getUserById(currensUserId),
        },
    };
};
