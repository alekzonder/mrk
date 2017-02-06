module.exports = function (di) {
    di.program.command('clean')
        .alias('c')
        .description('remove rendered files')
        .action(function () {
            var fs = require('fs-extra');

            di.logger.info('clean dir: ' + di.config.get('wwwDir'));
            fs.emptyDirSync(di.config.get('wwwDir'));
            di.logger.info('done');
        });
};
