require('babel-core/register')({
    extensions: [
        '.es6'
    ]
});

module.exports = require('./src/router');
