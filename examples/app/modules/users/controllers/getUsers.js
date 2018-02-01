const users = require('../models/users');

module.exports = () => {
    return {
        data: {
            users: users.get(),
        },
    };
};
