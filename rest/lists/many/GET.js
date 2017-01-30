var joi = require('joi');

var helpers = require('maf/Rest/helpers');

module.exports = {
    title: 'lists',

    schema: {
        query: {
            limit: joi.number().default(10).min(0).max(100),
            offset: joi.number().default(0).min(0).max(100),
            fields: helpers.fields.schema
        }
    },

    callback: function (req, res) {
        var lists = req.di.api.lists;

        var filters = helpers.filters.get(req.query, []);
        var fields = helpers.fields.get(req.query, 'fields');

        lists.find(filters, fields)
            .limit(req.query.limit)
            .skip(req.query.offset)
            .exec()
            .then((result) => {
                res.result(helpers.findResult(result, req.query, lists));
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
