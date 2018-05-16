const users = require('../../../../data/users.json');

class Users {
    constructor(data) {
        this.data = data;
    }

    get() {
        return this.data;
    }

    getUserById(id) {
        return this.data.find(({ id: userId }) => (userId === id));
    }
}

module.exports = new Users(users);
