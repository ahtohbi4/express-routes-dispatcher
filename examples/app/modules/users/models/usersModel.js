const users = require('../../../../data/users.json');

const Users = function (data) {
    this.data = data;
};

Users.prototype.get = function () {
    return this.data;
};

Users.prototype.getUserById = function (id) {
    return this.data.find(({ id: userId }) => (userId === id));
};

module.exports = new Users(users);
