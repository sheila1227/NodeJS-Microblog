/**
 * Created by sunjing on 15/5/28.
 */
var log4js = require('log4js');
log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'file', filename: 'logs/access.log', category: 'normal'}

    ]
});

exports.logger = function () {
    var logger = log4js.getLogger('normal');//获取配置文件中category为normal的appender
    logger.setLevel('INFO');
    return logger;
}

exports.log4js=log4js;