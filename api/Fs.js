'use strict';

var path = require('path');
var fs = require('fs-extra');
var klaw = require('klaw');
var chokidar = require('chokidar');

/**
 * Fs api
 */
class Fs {

    /**
     * @param {logger} logger
     * @param {config} config
     */
    constructor (logger, config) {
        this._logger = logger;
        this._config = config;
    }

    /**
     * readdir
     *
     * @param {String} filepath
     * @return {Promise}
     */
    readdir (filepath) {

        return new Promise((resolve, reject) => {

            var files = [];

            klaw(filepath)
                .on('error', (error) => {
                    reject(error);
                })
                .on('data', function (file) {

                    if (!this.check(file.path)) {
                        return;
                    }

                    // var stats = fs.lstatSync(file.path);
                    //
                    // if (stats.isDirectory() || stats.isSymbolicLink()) {
                    //     this._logger.debug('ignore directory ' + file.path);
                    //     return;
                    // }
                    //
                    // var ext = path.extname(file.path);
                    //
                    // if (ext !== '.md') {
                    //     this._logger.debug('ignore not .md ' + file.path);
                    //     return;
                    // }

                    files.push({
                        path: file.path,
                        dir: path.dirname(file.path),
                        basename: path.basename(file.path, '.md')
                    });

                })
                .on('end', function () {
                    resolve(files);
                });
        });

    }

    watchdir (filepath) {
        var watcher = chokidar.watch(filepath, {
            ignoreInitial: false,

            ignored: function (filepath, stats) {

                if (filepath.search(/www_md|node_modules|\.git/) > -1) {
                    return true;
                }

                if (stats && stats.isFile() && filepath.search(/\.md$/) === -1) {
                    return true;
                }

                return false;
            }
        });

        return watcher;
    }

    getRenderPath (filepath) {
        var dir = path.dirname(filepath);
        var base = path.basename(filepath, '.md');

        var dirTo = dir.replace(this._config.get('markdownDir'), '');

        var to = path.join(this._config.get('wwwDir'), dirTo, base + '.html');

        return to;
    }

    check (filepath) {
        var stats = fs.lstatSync(filepath);

        if (stats.isDirectory() || stats.isSymbolicLink()) {
            this._logger.debug('ignore directory ' + filepath);
            return false;
        }

        var ext = path.extname(filepath);

        if (ext !== '.md') {
            this._logger.debug('ignore not .md ' + filepath);
            return false;
        }

        return true;
    }

}

module.exports = Fs;
