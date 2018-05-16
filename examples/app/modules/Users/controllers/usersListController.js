const usersModel = require('../models/usersModel');

module.exports = () => ({
    data: {
        users: usersModel.get(),
    },
});
