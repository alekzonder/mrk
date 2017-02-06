module.exports = function (di) {

    di.program.command('render [cwd]')
        .alias('r')
        .option('--footer <file>', 'set custom footer, should close </body></html>')
        .option('--raw', 'render without header and footer')
        .description('render all .md files in work dir')
        .action(function (cwd, cmdOptions) {

            var path = require('path');
            var fs = require('fs-extra');
            var klaw = require('klaw');
            var _ = require('maf/vendors/lodash');

            if (cwd) {
                di.config.set('markdownDir', path.resolve(cwd));
            }

            di.logger.info('work dir = ' + di.config.get('markdownDir'));

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

            var queue = [];

            var markdownOptions = {};

            if (!cmdOptions.raw) {
                markdownOptions.header = fs.readFileSync(path.join(__dirname, '/../../templates/render', 'header.html')).toString();
                markdownOptions.footer = '';

                if (cmdOptions.footer) {

                    if (!fs.existsSync(cmdOptions.footer)) {
                        throw new Error('no footer file: ' + cmdOptions.footer);
                    }

                    markdownOptions.footer = fs.readFileSync(path.resolve(cmdOptions.footer)).toString();

                } else {
                    markdownOptions.footer = fs.readFileSync(path.join(__dirname, '/../../templates/render', 'footer.html')).toString();
                }
            }

            klaw(di.config.get('markdownDir'), options)
                .on('data', function (item) {

                    if (path.extname(item.path) !== '.md') {
                        return false;
                    }

                    if (item.stats.isDirectory()) {
                        return false;
                    }

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
                            di.api.markdown.renderFile(item.path, to, markdownOptions)
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
