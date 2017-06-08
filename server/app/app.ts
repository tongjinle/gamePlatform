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


class App {
    platfrom: Platform;
    constructor() {
        let pl = this.platfrom = new Platform();
        pl.initByConf(pfConfig);

        this.usCenter = getUserCenter();

        this.dict = {};
        this.bindSocket();

    }

    usCenter: UserCenter;

    dict: { [socketId: string]: string };

    bindList: [(app: App, socket: SocketIO.Socket) => void];

    io: SocketIO.Server;

    private bindSocket() {
        this.io.on("connect", (so) => {
            _.each(this.bindList, fn => fn(this, so));
        });
    }

    // 登陆
    login(data: dataStruct.IReqLoginData) {
        let { username, password } = data;
        this.usCenter.login(username, password, (data) => {
            let { flag, token } = data;
            if (flag) {
                
            }
        });
    }

}


let app = new App();

