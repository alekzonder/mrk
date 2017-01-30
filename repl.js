var logger = require('maf/Service/Logger')('mrk-repl');

var initRepl = require('maf/Service/Init/Repl');

var init = {
    config: require('./init/config'),
    di: require('./init/di')
};

initRepl(logger, init)
    .then(() => {
        logger.debug('repl started');
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
