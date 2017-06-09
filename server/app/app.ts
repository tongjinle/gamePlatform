import * as _ from 'underscore';
import * as SocketServer from 'socket.io';
import * as Http from 'http';
import * as async from 'async';
import Platform from '../logic/platform';
import { PlatformConfig as pfConfig } from '../platformConfig';
import * as dataStruct from "../logic/dataStruct";
import {
    UserCenter,
    getUserCenter
} from "../db/userCenter/userCenter";
import { User } from './user';
import logger from "../logic/logIns";



export default class App {
    serv: Http.Server;
    io: SocketIO.Server;
    platfrom: Platform;
    constructor() {
        // let pl = this.platfrom = new Platform();
        // pl.initByConf(pfConfig);

        // this.usCenter = getUserCenter();

        this.serv = Http.createServer()
        this.io = SocketServer(this.serv);

        this.io.on("connect", (so) => {
            let us = new User(so);
            us.app = this;
        });
    }






}



