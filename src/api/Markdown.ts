import * as fs from "fs-extra";
import * as MarkdownIt from "markdown-it";
import * as highlightJs from "highlight.js";

import { Logger, ConfigType } from "@/util";
import Fs from "./Fs";

// var plugins = {
//     taskLists: require('markdown-it-task-lists'),
//     emoji: require('markdown-it-emoji'),
//     footnote: require('markdown-it-footnote'),
//     ins: require('markdown-it-ins'),
//     sup: require('markdown-it-sup'),
//     sub: require('markdown-it-sub'),
//     anchor: require('markdown-it-anchor'),
//     mark: require('markdown-it-mark'),
//     // abbr: require('markdown-it-abbr')
// };
// var toc = require('markdown-toc');

const plugins = {};

/**
 * Markdown render class
 */
export default class Markdown {
  protected _logger: Logger;

  protected _config: ConfigType;

  protected _fsApi: Fs;

  protected _md: MarkdownIt;

  constructor(logger: Logger, config: ConfigType, fsApi: Fs) {
    this._logger = logger;
    this._config = config;
    this._fsApi = fsApi;

    this._md = this._initMarkdownIt();
  }

  async renderText(text: string) {
    //   const tocOptions = {
    //     bullets: "-",
    //     slugify: this._slugify,
    //   };

    //   text = toc.insert(text, tocOptions);

    return this._md.render(text);
  }

  renderFile(
    filepathFrom: string,
    filepathTo: string,
    options: any = {}
  ): Promise<{ from: string; to: string }> {
    return this._read(filepathFrom)
      .then((data) => this.renderText(data))
      .then((_text) => {
        let text = _text;

        if (typeof options.header === "string") {
          text = options.header + text;
        }

        if (typeof options.prefooter === "string") {
          text += options.prefooter;
        }

        if (typeof options.footer === "string") {
          text += options.footer;
        }

        text += "</body></html>";

        return this._save(filepathTo, text);
      })
      .then(() => ({
        from: filepathFrom,
        to: filepathTo,
      }));
  }

  watch(dir: string, options: any = {}) {
    const watcher = this._fsApi.watchdir(dir);

    const render = (filepath: string) => {
      const to = this._fsApi.getRenderPath(filepath);

      if (!this._fsApi.check(filepath)) {
        return;
      }

      this.renderFile(filepath, to, options)
        .then(() => {
          this._logger.info(`render file: ${filepath} => ${to}`);
        })
        .catch((error) => {
          this._logger.error(error);
        });
    };

    watcher.on("add", render);
    watcher.on("change", render);

    return watcher;
  }

  _read(filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data.toString());
      });
    });
  }

  _save(filepath: string, data: any) {
    return new Promise((resolve, reject) => {
      fs.outputFile(filepath, data, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve(filepath);
      });
    });
  }

  _initMarkdownIt(): MarkdownIt {
    return new MarkdownIt({
      highlight: (code, type) => {
        let hl = code;

        try {
          if (type) {
            hl = highlightJs.highlight(type, code).value;
          } else {
            hl = highlightJs.highlightAuto(code).value;
          }
        } catch (error) {
          this._logger.error(error);
        }

        return hl;
      },

      typographer: true,
      linkify: true,
      html: true,
    });

    // this._md.use(plugins.taskLists, { label: true });
    // this._md.use(plugins.emoji);
    // this._md.use(plugins.footnote);
    // this._md.use(plugins.sub);
    // this._md.use(plugins.sup);
    // this._md.use(plugins.ins);
    // this._md.use(plugins.mark);
    // this._md.use(plugins.abbr);
    // this._md.use(mdContainer);

    // this._md.use(plugins.anchor, {
    //   level: 1,
    //   slugify: this._slugify,
    //   permalink: true,
    //   permalinkClass: "header-anchor",
    //   permalinkSymbol: "#",
    //   permalinkBefore: false,
    // });

    // this._md.renderer.rules.table_open = function () {
    //     return '<table class="mrk table">\n';
    // };
  }

  /**
   * @private
   * @param {String} text
   * @return {String}
   */
  _slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[^\w-]/g, "");
  }
}
