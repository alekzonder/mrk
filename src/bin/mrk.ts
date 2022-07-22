import * as path from "path";
import * as http from "http";
import * as fs from "fs-extra";

import * as finalhandler from "finalhandler";
import * as express from "express";

import * as serveIndex from "serve-index";
import * as serveStatic from "serve-static";

import { Logger, Config } from "@/util";
import Fs from "@/api/Fs";
import Markdown from "@/api/Markdown";

const cwd = process.cwd();

const defaultConfig = {
  host: "localhost",
  port: 3334,
  logLevel: "INFO",
  markdownDir: cwd,
  wwwDir: path.join(cwd, "www_md"),
};

const mrk = () => {
  const logger = new Logger();

  const config = new Config();

  config.setData(defaultConfig);

  const fsApi = new Fs(logger, config);
  const markdownApi = new Markdown(logger, config, fsApi);

  const index = serveIndex(config.get("wwwDir"), {
    icons: true,
    view: "details",
    template: path.join(__dirname, "..", "..", "templates", "template.html"),
    stylesheet: path.join(__dirname, "..", "..", "templates", "style.css"),
  });

  markdownApi.watch(config.get("markdownDir"), {
    header: fs
      .readFileSync(
        path.join(__dirname, "..", "..", "templates/render/header.html")
      )
      .toString(),
    prefooter: fs
      .readFileSync(
        path.join(__dirname, "..", "..", "templates/render/prefooter.html")
      )
      .toString(),
    footer: "",
  });

  const serve = serveStatic(config.get("wwwDir"));

  const server = http.createServer((req, res) => {
    const done = finalhandler(req, res);

    serve(req, res, (err) => {
      if (err) {
        return done(err);
      }

      return index(req, res, done);
    });
  });

  const app = express();

  const host = config.get("host");
  const port = config.get("port");

  app.listen = (...args) => {
    server.listen.apply(server, args);
  };

  app.listen(port, host, () => {
    logger.info(`listen on http://${host}:${port}`);
  });
};

mrk();
