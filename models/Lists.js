'use strict';

var Abstract = require('maf/Model/Mongodb');

class Lists extends Abstract {

    constructor (db) {
        super(db);

        this._collectionName = 'lists';

        this._indexes = [
            {
                fields: {
                    name: 1
                },
                options: {
                    name: 'name',
                    unique: true,
                    background: true
                }
            }
        ];
    }

}

module.exports = Lists;
