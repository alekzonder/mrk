var path = require('path');
var joi = require('joi');

var cwd = process.cwd();

var config = {
    host: 'localhost',
    port: 8082,

    logLevel: 'TRACE',

    markdownDir: cwd,

    wwwDir: path.join(cwd, 'www_md'),

    nprof: {
        snapshotPath: '/data/tmp/mrk'
    },

    api: {

    }

};

module.exports = {
    host: joi.string().allow(null).default(config.host),
    port: joi.number().default(config.port),

    markdownDir: joi.string().default(config.markdownDir),
    wwwDir: joi.string().default(config.wwwDir),

    nprof: joi.object().default(config.nprof).keys({
        snapshotPath: joi.string().default(config.nprof.snapshotPath)
    }),

    api: joi.object().default(config.api).keys({})
};
