var joi = require('joi');

var helpers = require('maf/Rest/helpers');


module.exports = {
    title: 'get and update list by name',

    schema: {
        path: {
            ':name': joi.string().required()
        },
        query: {
            fields: helpers.fields.schema
        }
    },


    callback: function (req, res) {
        var lists = req.di.api.lists;

        var fields = helpers.fields.get(req.query, 'fields');

        lists.getByName(req.params.name, fields)
            .then((list) => {

                if (!list) {
                    return res.notFound(
                        new lists.Error(lists.Error.CODES.NOT_FOUND)
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
