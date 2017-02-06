var request = require('superagent');
var path = require('path');
var klaw = require('klaw');
var _ = require('maf/vendors/lodash');

module.exports = function (di) {

    di.program.command('upload <url>')
        .alias('up')
        .action(function (url) {

            var options = {};

            var queue = [];

            klaw(di.config.get('wwwDir'), options)
                .on('data', function (item) {

                    if (path.extname(item.path) !== '.html') {
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
                    di.logger.info(`upload ${queue.length} files`);

                    var promises = [];

                    for (var raw of queue) {
                        promises.push(new Promise((resolve, reject) => {

                            var item = _.cloneDeep(raw);

                            var cleanFilename = item.path.replace(di.config.get('wwwDir'), '').replace(path.sep, '/');

                            if (cleanFilename.search(/^\//) === -1) {
                                cleanFilename = '/' + cleanFilename;
                            }

                            var uploadUrl = url + cleanFilename;

                            var upload = request.put(uploadUrl)
                                .set('Content-Type', 'text/plain')
                                .attach('text/plain', item.path, {
                                    header: '',
                                    contentType: 'text/plain'
                                });

                            // monkey patching :(
                            var formData = upload._getFormData();

                            formData._lastBoundary = function () {
                                return '\r\n';
                            };

                            upload
                                .end((error) => {
                                    if (error) {
                                        return reject(error);
                                    }

                                    resolve();
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
