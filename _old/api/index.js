var createApiCollection = require('maf/Api/createCollection');

module.exports = (config, models, di) => {

    return new Promise((resolve, reject) => {

        var apiClasses = {
            markdown: require(__dirname + '/Markdown'),
            fs: require(__dirname + '/Fs'),
        };

        var createFunctions = {

            markdown: function (di, ApiClass) {
                return new ApiClass(di.logger, di.config, di.api);
            },

            fs: function (di, ApiClass) {
                return new ApiClass(di.logger, di.config);
            },

            default: function (di, ApiClass) {
                return new ApiClass(di.models, di.api);
            }
        };

        // old style init createFunctionss
        // var createFunctions = function (di, ApiClass) {
        //     return new ApiClass(di.models, di.api);
        // };

        createApiCollection(di, apiClasses, createFunctions)
            .then((api) => {
                resolve(api);
            })
            .catch((error) => {
                reject(error);
            });

    });

};
