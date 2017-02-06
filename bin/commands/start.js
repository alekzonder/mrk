module.exports = function (di) {

    di.program.command('start')
        .alias('s')
        .description('start markdown server')
        .action(function () {
            var path = require('path');
            require(path.join(__dirname, '..', '..', 'server'))(di);
        });

};
