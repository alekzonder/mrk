var MongoClient = require('mongodb').MongoClient;

module.exports = (config, di) => {

    return new Promise((resolve, reject) => {

        MongoClient.connect(config.get('db.dsl'))
        .then((db) => {

            // var Logger = require('mongodb').Logger;
            // Logger.setLevel('debug');
            // Logger.setCurrentLogger(function(msg, context) {
            //     di.logger.debug(msg, context);
            // });

            di.setConnection('db', db);

            resolve();

        })
        .catch((error) => {
            reject(error);
        });

    });

};
