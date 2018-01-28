const users = require('../../../data/users.json');

module.exports = () => {
    return {
        data: {
            users: users,
        },
    };
};
