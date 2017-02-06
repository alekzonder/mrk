var path = require('path');

module.exports = function (di) {

    di.program.command('start')
        .alias('s')
        .description('start markdown server')
        .action(function () {
            require(path.join(__dirname, '..', '..', 'server'))(di);
        });

};
