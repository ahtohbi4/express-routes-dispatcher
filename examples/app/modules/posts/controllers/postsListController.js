const postsModel = require('../models/postsModel');

module.exports = () => {
    return {
        data: {
            posts: postsModel.get(),
        },
    };
};
