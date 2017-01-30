'use strict';

var path = require('path');
var fs = require('fs-extra');

var MarkdownIt = require('markdown-it');
var mdTaskLists = require('markdown-it-task-lists');
var mdEmoji = require('markdown-it-emoji');
var mdContainer = require('markdown-it-container');
var mdFootnote = require('markdown-it-footnote');
var highlightJs = require('highlight.js');
var slug = require('limax');

/**
 * Markdown render class
 */
class Markdown {

    /**
     * @param {logger} logger
     * @param {config} config
     * @param {Object} api
     */
    constructor (logger, config, api) {
        this._logger = logger;
        this._config = config;
        this._api = api;

        this._md = null;

        this._init();
    }

    /**
     * render markdown from text string
     *
     * @param {String} text
     * @return {Promise}
     */
    renderText (text) {

        return new Promise((resolve, reject) => {
            resolve(this._md.render(text));
        });

    }

    /**
     * render markdown file
     *
     * @param {String} filepathFrom
     * @param {String} filepathTo
     * @param {Object} options
     * @return {Promise}
     */
    renderFile (filepathFrom, filepathTo, options) {

        return new Promise((resolve, reject) => {

            if (!options) {
                options = {};
            }

            this._read(filepathFrom)
                .then((data) => {
                    return this.renderText(data);
                })
                .then((text) => {

                    if (typeof options.header === 'string') {
                        text = options.header + text;
                    }

                    if (typeof options.footer === 'string') {
                        text = text + options.footer;
                    }

                    return this._save(filepathTo, text);
                })
                .then(() => {
                    resolve({
                        from: filepathFrom,
                        to: filepathTo
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });

    }

    watch (dir, options) {

        if (!options) {
            options = {};
        }

        var watcher = this._api.fs.watchdir(dir);

        watcher.on('add', (filepath) => {
            var to = this._api.fs.getRenderPath(filepath);

            if (!this._api.fs.check(filepath)) {
                return;
            }

            this.renderFile(filepath, to, options)
                .then(() => {
                    this._logger.info(`render file: ${filepath} => ${to}`);
                }).catch((error) => {
                    this._logger.error(error);
                });
        });

        watcher.on('change', (filepath) => {
            var to = this._api.fs.getRenderPath(filepath);

            if (!this._api.fs.check(filepath)) {
                return;
            }

            this.renderFile(filepath, to, options)
                .then(() => {
                    this._logger.info(`render file: ${filepath} => ${to}`);
                }).catch((error) => {
                    this._logger.error(error);
                });
        });

        return watcher;
    }

    /**
     * @private
     * @param {String} filepath
     * @return {Promise}
     */
    _read (filepath) {

        return new Promise((resolve, reject) => {

            fs.readFile(filepath, (error, data) => {
                if (error) {
                    return reject(error);
                }

                resolve(data.toString());
            });

        });

    }

    /**
     * @private
     * @param {String} filepath
     * @param {String} data
     * @return {Promise}
     */
    _save (filepath, data) {

        return new Promise((resolve, reject) => {

            fs.outputFile(filepath, data, (error) => {

                if (error) {
                    return reject(error);
                }

                resolve(filepath);

            });
        });

    }

    /**
     * @private
     */
    _init () {

        this._md = new MarkdownIt({
            highlight: function (code) {
                var hl = highlightJs.highlightAuto(code).value;
                return hl;
            },

            typographer: true,
            linkify: true,
            html: true
        });

        this._md.use(mdTaskLists, {label: true});
        this._md.use(mdEmoji);
        this._md.use(mdFootnote);
        // this._md.use(mdContainer);

        this._md.use(require('markdown-it-anchor'), {
            level: 1,
            slugify: slug,
            permalink: true,
            permalinkClass: 'header-anchor',
            permalinkSymbol: '#',
            permalinkBefore: false
        });

    }


}

module.exports = Markdown;
