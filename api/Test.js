'use strict';

var Abstract = require('maf/Api/BaseAbstract');

class Test extends Abstract {

    constructor (customInitData) {
        super();
        this._customInitData = customInitData;
    }

    test () {

        return new Promise((resolve, reject) => {
            resolve(this._customInitData);
        });

    }
}

module.exports = Test;
