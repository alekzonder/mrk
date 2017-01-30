'use strict';

var Abstract = require('maf/Model/Mongodb');

class Tasks extends Abstract {

    constructor (db) {
        super(db);

        this._collectionName = 'tasks';

        this._indexes = [];
    }

}

module.exports = Tasks;
