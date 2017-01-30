var joi = require('joi');

var helpers = require('maf/Rest/helpers');

module.exports = {
    title: 'tasks',

    schema: {
        query: {
            limit: joi.number().default(10).min(0).max(100),
            offset: joi.number().default(0).min(0).max(100),
            done: joi.boolean(),
            fields: helpers.fields.schema
        }
    },

    callback: function (req, res) {
        var tasks = req.di.api.tasks;

        var filters = helpers.filters.get(req.query, ['done']);
        var fields = helpers.fields.get(req.query, 'fields');

        tasks.find(filters, fields)
            .limit(req.query.limit)
            .skip(req.query.offset)
            .exec()
            .then((result) => {
                res.result(helpers.findResult(result, req.query, tasks));
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
