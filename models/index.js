var createModelCollection = require('maf/Model/createCollection');

module.exports = (config, di) => {

    return new Promise((resolve, reject) => {

        var modelClasses = {
            // lists: require('./Lists'),
            // tasks: require('./Tasks')
        };

        var createModelFn = function (di, ModelClass) {
            return new ModelClass(di.getConnection('db'));
        };

        createModelCollection(di, modelClasses, createModelFn)
            .then((models) => {
                resolve(models);
            })
            .catch((error) => {
                reject(error);
            });

    });

};
