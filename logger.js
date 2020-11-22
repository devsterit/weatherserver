const fs = require('fs');
const path = require('path');

var dir = __dirname + '/logs';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}


class Logger {

    constructor() {
        ['errors.txt', 'info.txt', 'warnings.txt', 'fatal.txt'].forEach(
            typeLog => {
                fs.open(path.join(dir, typeLog), 'r', function (err, fd) {
                    if (err) {
                        fs.writeFile(path.join(dir, typeLog), '', function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } 
                });
            }
        )
    }

    error(msg) {
        fs.appendFile(path.join(dir, 'errors.txt'),
            `\n${new Date().toISOString()} ${msg}`,
            function (err) {
                if (err) throw err;
            });
    }

    info(msg) {
        fs.appendFile(path.join(dir, 'info.txt'),
            `\n${new Date().toISOString()} ${msg}`,
            function (err) {
                if (err) throw err;
            });
    }

    warning(msg) {
        fs.appendFile(path.join(dir, 'warnings.txt'),
            `\n${new Date().toISOString()} ${msg}`,
            function (err) {
                if (err) throw err;
            });
    }

    fatal(msg) {
        fs.appendFile(path.join(dir, 'fatal.txt'),
            `\n${new Date().toISOString()} ${msg}`,
            function (err) {
                if (err) throw err;

                throw `${msg}`;
            });
    }
}

exports.logger = new Logger();