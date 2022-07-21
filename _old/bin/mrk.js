#!/usr/bin/env node
var path = require('path');

var logger = require('maf/Service/Logger')('mrk', 'INFO');

var pattern = '%[%5.5p%]   %m';

logger.configure({
    appenders: [{
        type: 'console',
        layout: {
            type: 'pattern',
            pattern: pattern
        }
    }]
});

require('maf/init/errorHandlers')(logger);

var init = {
    config: require(path.join(__dirname, '/../init/config')),
    di: require(path.join(__dirname, '/../init/di')),
};

init.config(logger)
    .then((config) => {
        logger.setLevel(config.get('logLevel'));
        return init.di(logger, config);
    })
    .then((di) => {
        di.program = require('commander');

        var pkg = require(path.join(__dirname, '..', 'package.json'));

        di.pkg = pkg;

        di.program.version(pkg.version);

        require(path.join(__dirname, 'commands', 'version'))(di);
        require(path.join(__dirname, 'commands', 'start'))(di);
        require(path.join(__dirname, 'commands', 'render'))(di);
        require(path.join(__dirname, 'commands', 'clean'))(di);
        require(path.join(__dirname, 'commands', 'upload'))(di);
        require(path.join(__dirname, 'commands', 'noCommand'))(di);

        di.program.parse(process.argv);

        if (di.program.args.length === 0) {
            require(path.join(__dirname, '..', 'server'))(di);
        }

    })
    .catch(function (error) {
        logger.error(error);
        process.exit(1);
    });
