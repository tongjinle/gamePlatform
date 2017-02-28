import * as _ from 'underscore';
import * as SocketIO from 'socket.io';
import * as Http from 'http';
import * as async from 'async';
import CONFIG from './config';
import * as log4js from 'log4js';


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


let logger = log4js.getLogger('app');

class App {
    serv: Http.Server;
    io: SocketIO.Server;
    constructor() {
        this.serv = Http.createServer();
        this.io = SocketIO(this.serv);

        this.serv.listen(CONFIG.PORT, () => {
            logger.debug(`start server at ${new Date().toTimeString()}`);
        });
    }
}


let app = new App();

