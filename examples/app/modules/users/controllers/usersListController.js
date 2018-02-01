const usersModel = require('../models/usersModel');

module.exports = () => {
    return {
        data: {
            users: usersModel.get(),
        },
    };
};
