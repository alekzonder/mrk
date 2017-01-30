var joi = require('joi');

var schema = require('./config.schema.js');

joi.validate({}, schema, function (err, valid) {
    if (err) {
        throw err;
    }

    console.log(valid);
});
