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
import Pathnode from '../logic/pathnode';


export default class App {
    serv: Http.Server;
    io: SocketIO.Server;
    platfrom: Platform;
    // 根节点
    root: Pathnode;
    // 平台上所有用户
    userList: User[];
    constructor() {
        // let pl = this.platfrom = new Platform();
        // pl.initByConf(pfConfig);

        // this.usCenter = getUserCenter();

        this.serv = Http.createServer()
        this.io = SocketServer(this.serv);
        this.userList = [];

        this.io.on("connect", (so) => {
            let us = new User(so);
            us.app = this;

            //
            this.userList.push(us);
        });

        this.initNodes();
    }

    // 初始化平台的所有节点
    initNodes():void{
        // todo
    }


    // 通过名字获取某个节点
    getNodeByName(nodename:string):Pathnode{
        return undefined;
    }


    // 获取某个房间的所有用户
    getUserList(nodeName:string):User{
        return _.filter(this.userList, us => us.currNode == nodeName);
    }


}



