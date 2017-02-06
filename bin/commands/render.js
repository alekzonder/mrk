var path = require('path');
var klaw = require('klaw');
var _ = require('maf/vendors/lodash');


module.exports = function (di) {

    di.program.command('render')
        .alias('r')
        .description('render all .md files in work dir')
        .action(function () {
            var cwd = process.cwd();

            var options = {
                filter: function (filepath) {
                    if (di.api.fs.isIgnored(filepath)) {
                        return false;
                    }

                    if (filepath.search(di.config.get('wwwDir')) > -1) {
                        return false;
                    }

                    return true;
                }
            };

            var started = 0;
            var done = 0;

            var queue = [];

            klaw(di.config.get('markdownDir'), options)
                .on('data', function (item) {

                    if (path.extname(item.path) !== '.md') {
                        return false;
                    }

                    if (item.stats.isDirectory()) {
                        return false;
                    }

                    started = 0;

                    queue.push(item);

                })
                .on('error', function (error) {
                    throw error;
                })
                .on('end', function () {
                    di.logger.info(`render ${queue.length} files`);

                    var promises = [];

                    for (var raw of queue) {
                        promises.push(new Promise((resolve, reject) => {

                            var item = _.cloneDeep(raw);

                            var to = di.api.fs.getRenderPath(item.path);
                            di.api.markdown.renderFile(item.path, to)
                                .then(() => {
                                    di.logger.info(`render file: ${item.path} => ${to}`);
                                    resolve();
                                })
                                .catch((error) => {
                                    reject(error);
                                });
                        }));
                    }

                    Promise.all(promises)
                        .then(() => {
                            di.logger.info('done');
                        })
                        .catch((error) => {
                            di.logger.error(error);
                            process.exit(1);
                        });

                });
        });



};
