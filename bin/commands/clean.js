var fs = require('fs-extra');

module.exports = function (di) {
    di.program.command('clean')
        .alias('c')
        .description('remove rendered files')
        .action(function () {
            di.logger.info('clean dir: ' + di.config.get('wwwDir'));
            fs.emptyDirSync(di.config.get('wwwDir'));
            di.logger.info('done');
        });
};
