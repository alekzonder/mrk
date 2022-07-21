var path = require('path');

var init = {
    // db: require(path.join(__dirname, 'db')),
    models: require(path.join(__dirname, '..', 'models')),
    api: require(path.join(__dirname, '..', 'api'))
};

module.exports = require('maf/Service/Init/Di')(init);
