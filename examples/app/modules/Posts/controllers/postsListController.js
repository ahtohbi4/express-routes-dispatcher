const postsModel = require('../models/postsModel');

module.exports = () => ({
    data: {
        posts: postsModel.get(),
    },
});
