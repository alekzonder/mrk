'use strict';

var path = require('path');
var fs = require('fs-extra');

var MarkdownIt = require('markdown-it');

var plugins = {
    taskLists: require('markdown-it-task-lists'),
    emoji: require('markdown-it-emoji'),
    footnote: require('markdown-it-footnote'),
    ins: require('markdown-it-ins'),
    sup: require('markdown-it-sup'),
    sub: require('markdown-it-sub'),
    anchor: require('markdown-it-anchor'),
    mark: require('markdown-it-mark'),
    // abbr: require('markdown-it-abbr')
};

var highlightJs = require('highlight.js');
var toc = require('markdown-toc');

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

            const tocOptions = {
                bullets: '-',
                slugify: this._slugify
            };

            text = toc.insert(text, tocOptions);

            var rendered = this._md.render(text);

            resolve(rendered);

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

                    if (typeof options.prefooter === 'string') {
                        text = text + options.prefooter;
                    }

                    if (typeof options.footer === 'string') {
                        text = text + options.footer;
                    }

                    text = text + '</body></html>';

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
            highlight: function (code, type) {

                var hl = code;

                if (type) {
                    hl = highlightJs.highlight(type, code).value;
                } else {
                    hl = highlightJs.highlightAuto(code).value;
                }

                return hl;
            },

            typographer: true,
            linkify: true,
            html: true
        });

        this._md.use(plugins.taskLists, {label: true});
        this._md.use(plugins.emoji);
        this._md.use(plugins.footnote);
        this._md.use(plugins.sub);
        this._md.use(plugins.sup);
        this._md.use(plugins.ins);
        this._md.use(plugins.mark);
        // this._md.use(plugins.abbr);
        // this._md.use(mdContainer);

        this._md.use(plugins.anchor, {
            level: 1,
            slugify: this._slugify,
            permalink: true,
            permalinkClass: 'header-anchor',
            permalinkSymbol: '#',
            permalinkBefore: false
        });

        // this._md.renderer.rules.table_open = function () {
        //     return '<table class="mrk table">\n';
        // };

    }

    /**
     * @private
     * @param {String} text
     * @return {String}
     */
    _slugify (text) {
        var slug = text.toLowerCase()
          .replace(/\s/g, '-')
          .replace(/[^\w-]/g, '');

        return slug;
    }

}

module.exports = Markdown;
