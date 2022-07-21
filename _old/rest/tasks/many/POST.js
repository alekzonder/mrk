module.exports = {
    title: 'create new task',

    schema: {
        body: null
    },

    prehook: function (method, di) {
        method.schema.body = di.api.tasks.getCreationSchema();
    },

    callback: function (req, res) {
        var tasks = req.di.api.tasks;

        tasks.create(req.body)
            .then((doc) => {
                res.result(tasks.clearSystemFields(doc));
            })
            .catch((error) => {

                if (!error.checkable) {
                    return res.logServerError(error);
                }

                error.getCheckChain(res.logServerError)
                    .ifEntity(tasks.entity)
                    .ifCode(tasks.Error.CODES.ALREADY_EXISTS, res.badRequest)
                    .end()
                    .check();


            });
    }
};
