import * as fs from "fs-extra";
import * as MarkdownIt from "markdown-it";
import * as highlightJs from "highlight.js";

import taskLists = require("markdown-it-task-lists");
import emoji = require("markdown-it-emoji");
import footnote = require("markdown-it-footnote");
import ins = require("markdown-it-ins");
import sup = require("markdown-it-sup");
import sub = require("markdown-it-sub");
import anchor = require("markdown-it-anchor");
import mark = require("markdown-it-mark");
import toc = require("markdown-it-table-of-contents");
import obsidian = require("markdown-it-obsidian");

import { Logger, ConfigType } from "@/util";
import Fs from "./Fs";

const plugins = {
  taskLists,
  emoji,
  footnote,
  ins,
  sup,
  sub,
  anchor,
  mark,
  toc,
  obsidian,
  // abbr: require('markdown-it-abbr')
};

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

  async renderText(_text: string) {
    let text = _text;

    // const tocOptions = {
    //   bullets: "-",
    //   slugify: this._slugify,
    // };

    // text = toc(text, tocOptions);

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
    const md = new MarkdownIt({
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

    md.use(plugins.taskLists, { label: true });
    md.use(plugins.emoji);
    md.use(plugins.footnote);
    md.use(plugins.sub);
    md.use(plugins.sup);
    md.use(plugins.ins);
    md.use(plugins.mark);
    md.use(plugins.toc);
    md.use(plugins.obsidian);
    // this._md.use(plugins.abbr);
    // this._md.use(mdContainer);

    md.use(plugins.anchor, {
      level: 1,
      slugify: this._slugify,
      permalink: true,
      permalinkClass: "header-anchor",
      permalinkSymbol: "#",
      permalinkBefore: false,
    });

    md.renderer.rules.table_open = function () {
      return '<table class="mrk table">\n';
    };

    return md;
  }

  _slugify(text: string): string {
    return encodeURIComponent(
      String(text).trim().toLowerCase().replace(/\s+/g, "-")
    );
  }
}
