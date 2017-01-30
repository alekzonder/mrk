var joi = require('maf/vendors/joi');

module.exports = {
    title: 'update list by name',

    schema: {
        path: {
            ':name': joi.string().required()
        }
    },

    prehook: function (method, di) {
        method.schema.body = di.api.lists.getModificationSchema();
    },

    callback: function (req, res) {
        var lists = req.di.api.lists;

        lists.updateByName(req.params.name, req.body)
            .then((list) => {
                res.result(list);
            })
            .catch((error) => {
                if (!error.checkable) {
                    return res.logServerError(error);
                }

                error.getCheckChain(res.logServerError)
                    .ifEntity(lists.entity)
                    .ifCode(lists.Error.CODES.NOT_FOUND, res.notFound)
                    .end()
                    .check();
            });
    }
};
