var path = require('path');
var fs = require('fs');

var logger = require('maf/Service/Logger')('mrk-render');

var init = {
    config: require(path.join(__dirname, '/../init/config')),
    di: require(path.join(__dirname, '/../init/di'))
};

var di = null;

var header = fs.readFileSync(path.join(__dirname, '/../templates/render', 'header.html')).toString();
var footer = fs.readFileSync(path.join(__dirname, '/../templates/render', 'footer.html')).toString();

init.config(logger)
    .then((config) => {
        return init.di(logger, config);
    })
    .then((_di) => {
        di = _di;
        logger.info(`reading ${di.config.get('markdownDir')}`);
        return di.api.fs.readdir(di.config.get('markdownDir'));
    })
    .then((files) => {
        var promises = [];

        for (var file of files) {

            var to = di.api.fs.getRenderPath(file.path);

            logger.info(`render file: ${file.path} => ${to}`);

            promises.push(
                di.api.markdown.renderFile(file.path, to, {header: header, footer: footer})
            );
        }

        return Promise.all(promises);
    })
    .then((result) => {
        console.log(result);
    })
    .catch(function (error) {
        logger.fatal(error);
        process.exit(1);
    });
