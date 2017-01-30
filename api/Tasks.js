'use strict';

var joi = require('maf/vendors/joi');

var Abstract = require('maf/Api/Abstract');

class Tasks extends Abstract {

    constructor (models, api) {
        super(models, api);

        this._modelName = 'tasks';

        this._setEntityName('task');

        this.Error.MESSAGES.ALREADY_EXISTS = 'task already exists';

        this._creationSchema = joi.object().keys({
            name: joi.string().required(),
            title: joi.string().required(),
            done: joi.boolean().default(false)
        });

        this._modificationSchema = joi.object().keys({
            name: joi.string(),
            title: joi.string(),
            done: joi.boolean()
        });
    }

}

module.exports = Tasks;
