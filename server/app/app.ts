import * as _ from 'underscore';
import * as SocketServer from 'socket.io';
import * as Http from 'http';
import * as async from 'async';
import Platform from '../logic/platform';


class App {
    platfrom: Platform;
    constructor() {
        let pl = this.platfrom = new Platform();

    }
}


let app = new App();

