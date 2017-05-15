import * as _ from 'underscore';
import * as SocketServer from 'socket.io';
import * as Http from 'http';
import * as async from 'async';
import Platform from '../logic/platform';
import * as pfConfig from '../platformConfig';


class App {
    platfrom: Platform;
    constructor() {
        let pl = this.platfrom = new Platform();
        pl.initByConf(pfConfig);
    }
}


let app = new App();

