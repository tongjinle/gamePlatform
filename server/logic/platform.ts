/*
    平台类
    0 处理socketIO相关的
    1 维护user跟其所建立的socket之间的关系
        setSocket和getSocket来完成
    2 维护频道
        新增 addChannel
        删除 removeChannel
        查找 findChannel
        暂停 pauseChannel
    
        ** 简单的使用配置文件来批量新增频道
        initByConf(conf)
*/
import * as _ from 'underscore';
import * as SocketServer from 'socket.io';
import * as Http from 'http';


import Pathnode from './pathnode';
import PathnodeType from './pathnodeType';
<<<<<<< HEAD
import Channel from './channel';
import Room from './room';

import * as pfConfig from '../platformConfig';
=======

>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
import { getUserCenter } from '../db/userCenter/userCenter';
import { getUserCache } from '../db/userCenter/userCache';
import CONFIG from './config';
import { IChannelOpts } from './iChannel';
import {
<<<<<<< HEAD
    PLATFORM_EVENTS,
    IPlatformfUserJoin,

    IPlatformUserJoin_C
=======
    TO_CLIENT_EVENTS,
    PLATFORM_EVENTS
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
} from './events';
import logger from "./logIns";
import {
    IReqLoginData,
    IResLoginData,
    IResUserJoinData,
    IResUserLeaveData,
    IReqChat,
    IResChat,

    ILoginData,
    ILogoutData,
    IChannelAddData,
    IChannelRemoveData,
    IUserJoinData,
    IUserLeaveData
} from './dataStruct';

import { IPlatformConfig } from '../platformConfig';



let usCenter = getUserCenter();
let usCache = getUserCache();
class Platform extends Pathnode {
    serv: Http.Server;
    io: SocketIO.Server;
    map: { [username: string]: SocketIO.Socket };
    constructor() {
        super('platform', PathnodeType.platform);

        this.serv = Http.createServer()
        this.io = SocketServer(this.serv);
        this.map = {};

        this.serv.listen(CONFIG.PORT, () => {
            let addrInfo = this.serv.address();
            logger.info(`server address : ${addrInfo.address}`);
            logger.info(`server port : ${addrInfo.port}`);
            logger.info(`start server at ${new Date().toTimeString()}`);
        });

        this.bind();
    }

    // 根据配置文件来生成频道
    initByConf(conf: IPlatformConfig) {
        _.each(conf.channelList, (chan) => {
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
    getSocket(username: string): string {
        let socketId = this.extInfo(username, 'socket') as string;
        return socketId;
    }

    setSocket(username: string, socketId: string): boolean {
        return this.extInfo(username, 'socket', socketId) as boolean;
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

    // 聊天
    // from 和 toList都是username
    chat(chMsg: IChatMsg) {
        let {roomName, from, msg, toList} = chMsg;
        let flag = true;
        let paNode = this.name == roomName ?
            this :
            this.findDescendant(roomName);

        // 不存在这样的pathnode
        if (!paNode) {
            logger.warn('chat', `no such pathnode:${roomName}`);
            return;
        }


        //

        let io = this.io;
        let frSocket = this.getSocket(from);

        let msgBag = { from, msg, isPrivate: false };

        if (!toList) {
            io.to(roomName).emit(PLATFORM_EVENTS.CHAT, msgBag);
            logger.info('chat', JSON.stringify(chMsg));
        } else {
            msgBag.isPrivate = true;
            _.each(toList, to => {
                // to应该在这个pathnode中
                if (~paNode.findUserIndex(to)) {
                    let so = this.getSocket(to);
                    io.to(roomName).sockets[so.id].emit(PLATFORM_EVENTS.CHAT, msgBag);
                    logger.info(`private chat`, `${from} chat to ${to} : ${msg} `);
                }
            });
            if (toList.length) {
                let so = this.getSocket(from);
                io.to(roomName).sockets[so.id].emit(PLATFORM_EVENTS.CHAT, msgBag);

            }
        }
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
<<<<<<< HEAD

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
=======
            logger.info(`socket init: ${so.id}`);
            // 登陆
            // 登陆之后 在默认的大厅中
            so.on(TO_CLIENT_EVENTS.LOGIN, (data: IReqLoginData) => {
                let { username, password } = data;
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
                usCenter.login(username, password, data => {
                    let flag = data.flag;
                    let token: string;

<<<<<<< HEAD
                    if (data.flag) {
                        so['username'] = username;
                        let evData: IPlatformfUserJoin = {
                            username,
                            socket: so
                        };
                        this.fire(PLATFORM_EVENTS.PLATFORM_USER_JOIN, evData);
                    }

                    so.emit(PLATFORM_EVENTS.PLATFORM_USER_JOIN, { flag });
=======
                    // 登录回执
                    {
                        let data: IResLoginData = { flag, username };
                        so.emit(TO_CLIENT_EVENTS.LOGIN, data)
                    }

                    logger.info(`req login: ${username}:${password}:${so.id} ${flag ? 'succ' : 'fail'}`);


                    if (flag) {
                        // 触发进入pathnode
                        let data: IUserJoinData = {
                            pathnodeType: PathnodeType.platform,
                            pathnodeName: this.name,
                            username,
                            socketId: so.id
                        };
                        this.fire(PLATFORM_EVENTS.USER_JOIN, data);
                    }


>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
                });
            });
            // 登出
            so.on("disconnect", () => {
                // logger.debug('has socket', !!so);
                // logger.debug(`on disconnect -- all sockets: ${_.map(io.sockets.sockets,n=>n.id)}`);
                // logger.debug(`on disconnect of platform -- all sockets: ${_.map(io.nsps['/'].sockets,n=>n.id)}`);
                let username: string;
                username = this.getUsernameBySid(so.id);

                // 连上了server但是并没有登陆的情况
                if (!username) {
                    logger.warn(`disconnect without login: ${so.id}`);
                    return;
                }

                {
                    usCenter.logout(username);
                }
                {
                    let data: IUserLeaveData = { username, socket: so, pathnodeName: 'platform', pathnodeType: PathnodeType.platform };
                    this.fire(PLATFORM_EVENTS.USER_LEAVE, data);
                }
                logger.info(`req logout: ${username}:${so.id}`);
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
            so.on(TO_CLIENT_EVENTS.SUB_PATHNODE_LIST, () => {
                let subPathnodeList = _.map(this.children, ch => {
                    return {
                        pathnodeName: ch.name,
                        currUserCount: ch.usernameList.length,
                        maxUserCount: 100,
                        status: ch.status
                    }
                });
                logger.info(`req subPathnodeList: ${_.map(subPathnodeList,n=>n.pathnodeName)}`);
                so.emit(TO_CLIENT_EVENTS.SUB_PATHNODE_LIST, { flag: true, subPathnodeList });
            });

            // 进入某个房间

            // 退出某个房间

            // 游戏操作信息

            // 获取用户列表
            so.on(TO_CLIENT_EVENTS.USER_LIST, () => {
                let userList = this.usernameList;
                logger.info(`req userlist: ${userList.join('|')}`);
                so.emit(TO_CLIENT_EVENTS.USER_LIST, { flag: true, userList });
            });

            // 发送聊天信息
            // 因为username和socket的映射关系,所以聊天的信息都是通过platform这个顶点来中转信息
<<<<<<< HEAD
            so.on(PLATFORM_EVENTS.CHAT, (chatMsg: IChatMsg) => {
                chatMsg.from = so['username'];
                this.chat(chatMsg);
            });

            // 查询某个socket房间的人数
            so.on('userList.refresh', (data: { roomName: string }) => {
                let {roomName} = data;
                logger.info(`req userList.refresh:${roomName}`);
                let ret: any = { flag: false };

                let taNode = this.name == roomName ? this : this.findDescendant(name);
                if (taNode) {
                    let usernameList = taNode.usernameList;
                    let userList = _.map(usernameList, username => {
                        let status;
                        if (PathnodeType.room == taNode.type) {
                            status = (taNode as Room).getStatus(username);
                        }
                        return {
                            username,
                            status
                        };
                    });
                    ret = {
                        flag: true,
                        type: 'all',
                        roomName: taNode.name,
                        roomType: taNode.type,
                        userList
                    };
                }

                so.emit('userList.refresh', ret);
                if (!ret.flag) {
                    logger.error(`req userList.refresh:${roomName} FAIL`);
=======
            so.on(TO_CLIENT_EVENTS.CHAT, (chatMsg: IReqChat) => {
                let { message, to } = chatMsg;
                let username = this.getUsernameBySid(so.id);
                let isPrivate: boolean = !!to;
                let timestamp = Date.now();
                let flag: boolean = true;


                let data: IResChat = { flag, username, message, isPrivate, timestamp };
                logger.info(`req chat:`, data);
                so.emit(TO_CLIENT_EVENTS.CHAT, data);
                if (isPrivate) {
                    let otherSo = this.getSocketBySid(this.getSocket(to));
                    otherSo.emit(TO_CLIENT_EVENTS.CHAT, data);
                } else {
                    so.broadcast.emit(TO_CLIENT_EVENTS.CHAT, data);
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
                }
            });

        });



        // ########################################################
        // 绑定非socket相关
        // ########################################################

<<<<<<< HEAD
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
                flag: true,
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
                    flag: true,
                    type: 'remove',
                    roomName,
                    roomType,
                    userList: [{
                        username
                    }]
                });
            }
        });
=======
        // 用户登录,绑定socket
        this.on(PLATFORM_EVENTS.LOGIN, (data: ILoginData) => {
            let { username, socketId } = data;
            this.addUser(username);
            this.setSocket(username, socketId);
        });

        // 用户登出
        this.on(PLATFORM_EVENTS.LOGOUT, (data: ILogoutData) => {
            let { username, socketId } = data;
            this.setSocket(username, undefined);
            this.removeUser(username);
        });

        this.on(PLATFORM_EVENTS.CHANNEL_ADD, (data: IChannelAddData) => {
            logger.info(`add channel: ${data.channel.name}`);
        });

        // 用户进入节点
        this.on(PLATFORM_EVENTS.USER_JOIN, (data: IUserJoinData) => {
            let { pathnodeName, pathnodeType, username, socketId } = data;

            let socket = this.getSocketBySid(socketId);
            let node = this.findPathnode(pathnodeType, pathnodeName);
            if (node) {
                // 进入节点
                let flag: boolean = node.addUser(username);
                if (flag) {
                    // platform节点需要绑定socketId
                    if (PathnodeType.platform == pathnodeType) {
                        this.setSocket(username, socketId);
                    }
                    // 进入socket的房间
                    socket.join(pathnodeName, () => {
                        // 广播
                        // 通知有人进入节点
                        let data: IResUserJoinData = { flag, pathnodeName, username };
                        io.to(pathnodeName).emit(TO_CLIENT_EVENTS.USER_JOIN, data);
                        // socket.broadcast.emit(TO_CLIENT_EVENTS.USER_JOIN, data);
                        logger.info(`${username}:${socket.id} join room:${this.name}`);
                    });

                }

            }
        });

        // 用户离开节点
        this.on(PLATFORM_EVENTS.USER_LEAVE, (data: IUserLeaveData) => {
            let { username, socket, pathnodeName, pathnodeType } = data;
            let root: Pathnode = this;
            let open = [root];
            let stack = [];

            let target:Pathnode;
            let visit = (node:Pathnode)=>{
                if(target){return;}
                if(node.findUserIndex(username)>=0){
                    target=node;
                    return ;
                }else{
                    node.children.forEach(n=>visit(n));
                }
            };
            while(target){
                stack.push(target);
                target=target.father;
            }
            // while (open.length) {
            //     let curr = open.pop();
            //     if (-1 != curr.findUserIndex(username)) {
            //         stack.push(curr);
            //         open = curr.children;
            //     }
            // }

            // logger.debug(`all sockets: ${_.map(io.sockets.sockets,n=>n.id)}`);
            // logger.debug(socket.id, !!socket);
            stack./*reverse().*/forEach((node: Pathnode) => {
                let pathnodeName = node.name;
                socket.leave(pathnodeName);
                if (PathnodeType.platform == pathnodeType) {
                    this.setSocket(username, undefined);

                }
                let flag: boolean = node.removeUser(username);
                if (flag) {
                    // 广播
                    // 通知有人离开节点
                    let data: IResUserLeaveData = { flag, pathnodeName, username };
                    io.to(pathnodeName).emit(TO_CLIENT_EVENTS.USER_LEAVE, data);
                }
            });
        });

>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
    }

    private getSocketBySid(socketId: string): SocketIO.Socket {
        return this.io.sockets.sockets[socketId];
    }

    private getUsernameBySid(socketId: string): string {
        let username: string;
        username = _.find(this.usernameList, username => {
            let sid: string = this.getSocket(username);
            if (sid == socketId) {
                return true;
            }
        });
        return username;
    }

    private findPathnode(type: PathnodeType, name: string): Pathnode {
        let root: Pathnode = this;
        let open = [root];
        while (open.length) {
            let curr = open.pop();
            if (type == curr.type && name == curr.name) {
                return curr;
            }
            open = open.concat(curr.children);
        }
        return undefined;
    }




}

export default Platform;

