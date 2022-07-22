import path from "path";
import fs from "fs-extra";
import klaw from "klaw";
import chokidar from "chokidar";

import { Logger, ConfigType } from "@/util";

type ReaddirResultItem = {
  path: string;
  dir: string;
  basename: string;
};
type ReaddirResult = ReaddirResultItem[];

export default class Fs {
  protected _logger: Logger;

  protected _config: ConfigType;

  constructor(logger: Logger, config: ConfigType) {
    this._logger = logger;
    this._config = config;
  }

  readdir(filepath: string): Promise<ReaddirResult> {
    return new Promise((resolve, reject) => {
      const files: ReaddirResultItem[] = [];

      klaw(filepath)
        .on("error", (error) => {
          reject(error);
        })
        .on("data", (file) => {
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
            basename: path.basename(file.path, ".md"),
          });
        })
        .on("end", () => {
          resolve(files);
        });
    });
  }

  watchdir(dirpath: string) {
    const ignoredMatcher = (filepath: string, stats: fs.Stats): boolean => {
      if (this.isIgnored(filepath)) {
        return true;
      }

      if (filepath.search(this._config.get("wwwDir")) > -1) {
        return true;
      }

      return stats && stats.isFile() && filepath.search(/\.md$/) === -1;
    };

    return chokidar.watch(dirpath, {
      ignoreInitial: false,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ignored: ignoredMatcher as any,
    });
  }

  getRenderPath(filepath: string): string {
    const dir = path.dirname(filepath);
    const base = path.basename(filepath, ".md");
    const dirTo = dir.replace(this._config.get("markdownDir"), "");

    return path.join(this._config.get("wwwDir"), dirTo, `${base}.html`);
  }

  check(filepath: string): boolean {
    const stats = fs.lstatSync(filepath);

    if (stats.isDirectory() || stats.isSymbolicLink()) {
      this._logger.debug(`ignore directory ${filepath}`);
      return false;
    }

    const ext = path.extname(filepath);

    if (ext !== ".md") {
      this._logger.debug(`ignore not .md ${filepath}`);
      return false;
    }

    return true;
  }

  isIgnored(filepath: string): boolean {
    return filepath.search(/node_modules|\.git/) > -1;
  }
}
