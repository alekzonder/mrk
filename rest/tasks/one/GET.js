var joi = require('joi');

var helpers = require('maf/Rest/helpers');

module.exports = {
    title: 'get task by id',

    schema: {
        path: {
            ':id': joi.string().required()
        },
        query: {
            fields: helpers.fields.schema
        }
    },


    callback: function (req, res) {
        var tasks = req.di.api.tasks;

        var fields = helpers.fields.get(req.query, 'fields');

        tasks.getById(req.params.id, fields)
            .then((list) => {

                if (!list) {
                    return res.notFound(
                        new tasks.Error(tasks.Error.CODES.NOT_FOUND)
                    );
                }

                res.result(list);
            })
            .catch((error) => {
                if (!error.checkable) {
                    return res.logServerError(error);
                }

                error.getCheckChain(res.logServerError)
                    .check();
            });
    }
};
