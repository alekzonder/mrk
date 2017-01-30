var joi = require('maf/vendors/joi');

module.exports = {
    title: 'update task by id',

    schema: {
        path: {
            ':id': joi.string().required()
        }
    },

    prehook: function (method, di) {
        method.schema.body = di.api.tasks.getModificationSchema();
    },

    callback: function (req, res) {
        var tasks = req.di.api.tasks;

        tasks.updateById(req.params.id, req.body)
            .then((list) => {
                res.result(list);
            })
            .catch((error) => {
                if (!error.checkable) {
                    return res.logServerError(error);
                }

                error.getCheckChain(res.logServerError)
                    .ifEntity(tasks.entity)
                    .ifCode(tasks.Error.CODES.NOT_FOUND, res.notFound)
                    .end()
                    .check();
            });
    }
};
