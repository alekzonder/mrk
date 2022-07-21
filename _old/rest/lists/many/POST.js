var joi = require('joi');
var _ = require('lodash');

var helpers = require('maf/Rest/helpers');

module.exports = {
    title: 'create new list',

    schema: {
        body: null
    },

    prehook: function (method, di) {
        method.schema.body = di.api.lists.getCreationSchema();
    },

    callback: function (req, res) {
        var lists = req.di.api.lists;

        lists.create(req.body)
            .then((doc) => {
                res.result(lists.clearSystemFields(doc));
            })
            .catch((error) => {

                if (!error.checkable) {
                    return res.logServerError(error);
                }

                error.getCheckChain(res.logServerError)
                    .ifEntity(lists.entity)
                    .ifCode(lists.Error.CODES.ALREADY_EXISTS, res.badRequest)
                    .end()
                    .check();


            });
    }
};
