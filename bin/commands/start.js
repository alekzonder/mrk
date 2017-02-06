module.exports = function (di) {

    di.program.command('start [cwd]')
        .alias('s')
        .description('start markdown server')
        .action(function (cwd) {
            var path = require('path');

            if (cwd) {
                di.config.set('markdownDir', path.resolve(cwd));
            }

            di.logger.info('work dir = ' + di.config.get('markdownDir'));

            require(path.join(__dirname, '..', '..', 'server'))(di);
        });

};
