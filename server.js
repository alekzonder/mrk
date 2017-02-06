var path = require('path');
var fs = require('fs-extra');

module.exports = function (di) {

    // var init = {
    //     rest: require(path.join(__dirname, '/init/rest'))
    // };

    var finalhandler = require('finalhandler');
    var http = require('http');
    var express = require('express');
    var serveIndex = require('serve-index');
    var serveStatic = require('serve-static');

    var index = serveIndex(di.config.get('wwwDir'), {
        'icons': true,
        view: 'details',
        template:  path.join(__dirname, 'templates', 'template.html'),
        stylesheet: path.join(__dirname, 'templates', 'style.css')
    });

    var watcher = di.api.markdown.watch(di.config.get('markdownDir'), {
        header: fs.readFileSync(path.join(__dirname, 'templates/render/header.html')).toString(),
        footer: fs.readFileSync(path.join(__dirname, 'templates/render/footer.html')).toString()
    });

    var serve = serveStatic(di.config.get('wwwDir'));

    var server = http.createServer(function onRequest (req, res) {

        var done = finalhandler(req, res);

        serve(req, res, function onNext (err) {
            if (err) return done(err);
            index(req, res, done);
        });
    });

    var app = express();

    app.di = di;

    app.server = server;

    var host = di.config.get('host');
    var port = di.config.get('port');

    app.server.listen(port, host, function () {
        di.logger.info(`listen on http://${host}:${port}`);
    });

};

//
// var path = require('path');
// var fs = require('fs');
//
// var logger = require('maf/Service/Logger')('mrk');
//
// require('maf/init/errorHandlers')(logger);
//
// var init = {
//     config: require(path.join(__dirname, '/init/config')),
//     di: require(path.join(__dirname, '/init/di')),
//     rest: require(path.join(__dirname, '/init/rest'))
// };
//
// init.config(logger)
//     .then((config) => {
//         logger.setLevel(config.get('logLevel'));
//         return init.di(logger, config);
//     })
//     .then((di) => {
//
//         var finalhandler = require('finalhandler');
//         var http = require('http');
//         var express = require('express');
//         var serveIndex = require('serve-index');
//         var serveStatic = require('serve-static');
//
//         var index = serveIndex(di.config.get('wwwDir'), {
//             'icons': true,
//             view: 'details',
//             template:  path.join(__dirname, 'templates', 'template.html'),
//             stylesheet: path.join(__dirname, 'templates', 'style.css')
//         });
//
//         var watcher = di.api.markdown.watch(di.config.get('markdownDir'), {
//             header: fs.readFileSync(path.join(__dirname, 'templates/render/header.html')).toString(),
//             footer: fs.readFileSync(path.join(__dirname, 'templates/render/footer.html')).toString()
//         });
//
//         var serve = serveStatic(di.config.get('wwwDir'));
//
//         var server = http.createServer(function onRequest (req, res) {
//
//             var done = finalhandler(req, res);
//
//             serve(req, res, function onNext (err) {
//                 if (err) return done(err);
//                 index(req, res, done);
//             });
//         });
//
//         var app = express();
//
//         app.di = di;
//
//         app.server = server;
//
//         return app;
//
//     })
//     .then((app) => {
//
//         var config = app.di.config;
//
//         var host = config.get('host');
//         var port = config.get('port');
//
//         app.server.listen(port, host, function () {
//             logger.info(`listen on http://${host}:${port}`);
//         });
//
//     })
//     .catch((error) => {
//         logger.fatal(error);
//         throw error;
//     });
