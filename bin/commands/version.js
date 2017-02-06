module.exports = function (di) {
    di.program.command('version')
        .alias('v')
        .action(function () {
            console.log(di.pkg.version);
        });
};
