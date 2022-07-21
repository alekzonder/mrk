module.exports = function (di) {

    di.program.command('*')
        .action(function () {
            di.program.outputHelp();
            process.exit(1);
        });

};
