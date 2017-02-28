"use strict";
var SocketIO = require("socket.io");
var Http = require("http");
var config_1 = require("./config");
var log4js = require("log4js");
log4js.configure({
    appenders: [
        { type: 'console' },
        {
            type: 'dateFile',
            filename: './logs/app.log',
            "maxLogSize": 20480,
            "backups": 3,
            category: 'app'
        }
    ]
});
var logger = log4js.getLogger('app');
var App = (function () {
    function App() {
        this.serv = Http.createServer();
        this.io = SocketIO(this.serv);
        this.serv.listen(config_1.default.PORT, function () {
            logger.debug("start server at " + new Date().toTimeString());
        });
    }
    return App;
}());
var app = new App();
