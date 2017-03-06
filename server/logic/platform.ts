import * as _ from 'underscore';
import * as SocketServer from 'socket.io';
import * as Http from 'http';


import Pathnode from './pathnode';
import PathnodeType from './pathnodeType';
import Channel from './channel';
import Room from './room';

import * as pfConfig from '../platformConfig';
import { getUserCenter } from '../db/userCenter/userCenter';
import { getUserCache } from '../db/userCenter/userCache';
import CONFIG from './config';
import { IChannelOpts } from './iChannel';
import { IChatMsg } from './iChat';
import {
    PLATFORM_EVENTS,
    IPlatformfUserJoin,

    IPlatformUserJoin_C
} from './events';

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

let usCenter = getUserCenter();
let usCache = getUserCache();
class Platform extends Pathnode {
    serv: Http.Server;
    io: SocketIO.Server;
    map: { [username: string]: SocketIO.Socket };
    constructor() {
        super('platform', PathnodeType.platform);

        this.serv = Http.createServer();
        this.io = SocketServer(this.serv);
        this.map = {};

        this.serv.listen(CONFIG.PORT, () => {
            logger.debug(`start server at ${new Date().toTimeString()}`);
        });

        this.initByConf(pfConfig);
        this.bind();
    }

    // 根据配置文件来生成频道
    initByConf(conf) {
        _.each(conf.channelList, (chan: { name: string, gameType: string, maxUserCount: number, maxRoomCount: number }) => {
            let opts = {
                maxUserCount: chan.maxUserCount || 100,
                maxRoomCount: chan.maxRoomCount || 20
            } as IChannelOpts;
            this.addChannel(chan.name, chan.gameType, opts);
        });
    }


    // ########################################################
    // 建立username和socket的映射关系
    // ########################################################
    // socket相关
    getSocket(username: string): SocketIO.Socket {
        let so = this.extInfo(username, 'socket') as SocketIO.Socket;
        return so;
    }

    setSocket(username: string, so: SocketIO.Socket): boolean {
        return this.extInfo(username, 'socket', so) as boolean;
    }


    // ########################################################
    // 频道相关
    // ########################################################

    // 查找频道
    private findChannel(channalName: string): Channel {
        return this.findChild(channalName) as Channel;
    }

    // 创建频道
    // 不能有重名的频道
    private addChannel(channelName: string, gameType: string, opts: IChannelOpts): boolean {
        let chan = new Channel(channelName, gameType, opts);
        let ret = this.addChild(chan);


        ret && this.fire(PLATFORM_EVENTS.CHANNEL_ADD, { channel: chan });
        return ret;
    }

    // 暂停频道
    private pauseChannel(channelName: string): boolean {
        let chan = this.findChild(channelName) as Channel;
        if (!chan) {
            return false;
        }

        chan.pause();
    }


    // 删除频道
    private removeChannel(channelName: string): boolean {
        // before remove channel
        let chan = this.findChannel(channelName);
        if (chan) {
            this.fire(PLATFORM_EVENTS.CHANNEL_REMOVE, { channel: chan });
            let ret = this.removeChildByName(channelName);
            return ret;
        }
        return false;
    }


    // ########################################################
    // 相关绑定
    // ########################################################
    private bind() {
        // ########################################################
        // 绑定socket相关
        // ########################################################
        let io = this.io;

        // 连接
        io.on('connect', (so) => {

            logger.debug(`[connect] socket.id:${so.id}`);
            // io.use((so,next)=>{
            //     logger.debug(so.request);
            //     next();
            // });

            // // d.ts没有定义so.use
            // so['use']((packet, next) => {
            //     let evName: string = packet[0];
            //     let data = packet[1];

            //     if (PLATFORM_EVENTS.PLATFORM_USER_JOIN == evName) {
            //         next();
            //     } else {
            //         let token = data['token'];
            //         if (!usCache.isValid(token)) {
            //             next(new Error('invalid token'));
            //             logger.debug(`invalid token : ${token}`);
            //         } else {
            //             next();
            //         }
            //     }
            // });

            // 登陆
            // 登陆之后 在默认的大厅中
            so.on(PLATFORM_EVENTS.PLATFORM_USER_JOIN, (data: { username: string, password: string }) => {
                let {username, password} = data;
                logger.debug(`${username} try to join platform`);
                usCenter.login(username, password, data => {
                    let flag = data.flag;
                    let token: string;

                    if (data.flag) {
                        so['username'] = username;
                        let evData: IPlatformfUserJoin = {
                            username,
                            socket: so
                        };
                        this.fire(PLATFORM_EVENTS.PLATFORM_USER_JOIN, evData);
                    }

                    so.emit(PLATFORM_EVENTS.PLATFORM_USER_JOIN, { flag });
                });
            });

            // 断开链接
            so.on('disconnect', () => {
                logger.debug(`[disconnect] socket.id:${so.id}`);

                let username = so['username'];
                let evData = { username };
                this.fire(PLATFORM_EVENTS.PLATFORM_USER_LEAVE, evData);


            });


            // 进入某个频道
            /*
                频道是否存在
                尝试加入
            */

            so.on(PLATFORM_EVENTS.CHANNEL_USER_JOIN, (data: { channelName: string }) => {
                let flag: boolean = false;
                let {channelName} = data;
                let username = so['username'];
                let chan = this.findChannel(channelName);
                if (chan) {
                    flag = chan.addUser(username);
                }
                so.emit(PLATFORM_EVENTS.CHANNEL_USER_JOIN, {
                    flag
                });
            });

            // 退出某个频道
            /*
                尝试退出
            */

            // 查询某个频道中所有房间

            // 进入某个房间

            // 退出某个房间

            // 游戏操作信息

            // 发送聊天信息
            // 因为username和socket的映射关系,所以聊天的信息都是通过platform这个顶点来中转信息
            so.on(PLATFORM_EVENTS.CHAT, (chatMsg: IChatMsg) => {

            });

            // 查询某个socket房间的人数
            so.on('userList.refresh', (data: { roomName: string }) => {
                let {roomName} = data;
                logger.info(`req userList.refresh:${roomName} `);
                let ret: any = { flag: false };
                let nodeList: Pathnode[] = [this];
                while (nodeList.length) {

                    let paNode = nodeList.pop();
                    if (paNode.name == roomName) {
                        let usernameList = paNode.usernameList;
                        let userList = _.map(usernameList, username => {
                            let status;
                            if (PathnodeType.room == paNode.type) {
                                status = (paNode as Room).getStatus(username);
                            }
                            return {
                                username,
                                status
                            };
                        });
                        ret = {
                            flag: true,
                            type: 'all',
                            roomName: paNode.name,
                            roomType: paNode.type,
                            userList
                        };
                        break;
                    }
                    if (paNode.children && paNode.children.length) {
                        nodeList = nodeList.concat(paNode.children);
                    }
                }

                so.emit('userList.refresh', ret);
                if (!ret.flag) {
                    logger.error(`req userList.refresh:${roomName} FAIL`);
                }
            });

        });

        // io.on('reconnect',(so:SocketIO.Socket)=>{
        //     logger.debug(`[reconnect] socket.id:${so.id}`);
        // });



        // ########################################################
        // 绑定非socket相关
        // ########################################################

        // 用户进入大厅
        // 绑定socket和username之间的对应关系
        this.on(PLATFORM_EVENTS.PLATFORM_USER_JOIN, (data: IPlatformfUserJoin) => {
            let {username, socket} = data;
            this.addUser(username);
            this.setSocket(username, socket);
        });
        // 绑定socket
        // to client
        this.on(PLATFORM_EVENTS.PLATFORM_USER_JOIN, (data: IPlatformfUserJoin) => {
            let username = data.username;
            let so = data.socket;
            let roomName = this.name;
            let roomType = this.type;
            so.join(roomName, () => {
                logger.debug(`${username}:${so.id} join room:${this.name}`);
            
                so.emit(PLATFORM_EVENTS.SOCKET_ROOM_JOIN, {
                    roomType,
                    roomName
                });
            });
        });

        // 加入socket的room -- platform
        this.on(PLATFORM_EVENTS.PLATFORM_USER_JOIN, (data: IPlatformfUserJoin) => {
            let username = data.username;
            let so = data.socket;
            let roomName = this.name;
            let roomType = this.type;

            // 告知其他user我进入了platform
            let cliData: IPlatformUserJoin_C = { username };
            so.broadcast.to(roomName).emit('userList.refresh', {
                flag:true,
                type: 'add',
                roomName,
                roomType,
                userList: [{
                    username
                }]
            });
        });

        // 断线
        this.on(PLATFORM_EVENTS.PLATFORM_USER_LEAVE, (data: { username: string }) => {
            let {username} = data;
            let flag = this.removeUser(username);

            if (flag) {
                let roomName = this.name;
                let roomType = this.type;

                // platform上的userList更新
                io.to(this.name).emit('userList.refresh', {
                    flag:true,
                    type: 'remove',
                    roomName,
                    roomType,
                    userList: [{
                        username
                    }]
                });
            }
        });
    }





}

export default Platform;

