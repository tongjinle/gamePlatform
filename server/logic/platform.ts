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


import Channel from './channel';
import Pathnode from './pathnode';
import PathnodeType from './pathnodeType';

import { getUserCenter } from '../db/userCenter/userCenter';
import { getUserCache } from '../db/userCenter/userCache';
import CONFIG from './config';
import { IChannelOpts } from './iChannel';
import { IChatMsg } from './iChat';
import {
    TO_CLIENT_EVENTS,
    PLATFORM_EVENTS
} from './events';
import logger from "./logIns";
import {
    IReqLoginData,
    IResLoginData,
    IResUserJoinData,

    ILoginData,
    IUserJoinData,
    IUserLeaveData
} from './dataStruct';


let usCenter = getUserCenter();
let usCache = getUserCache();
class Platform extends Pathnode {
    serv: Http.Server;
    io: SocketIO.Server;
    constructor() {
        super('platform', PathnodeType.platform);

        this.serv = Http.createServer()
        this.io = SocketServer(this.serv);


        this.serv.listen(CONFIG.PORT, () => {
            let addrInfo = this.serv.address();
            logger.debug(`server address : ${addrInfo.address}`);
            logger.debug(`server port : ${addrInfo.port}`);
            logger.debug(`start server at ${new Date().toTimeString()}`);
        });

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
            // 登陆
            // 登陆之后 在默认的大厅中
            so.on(TO_CLIENT_EVENTS.LOGIN, (data: IReqLoginData) => {
                let { username, password } = data;
                usCenter.login(username, password, data => {
                    let flag = data.flag;
                    let token: string;

                    // 登录回执
                    {
                        let speSocket = io.sockets.sockets[so.id];
                        let data: IResLoginData = { flag };
                        speSocket.emit(TO_CLIENT_EVENTS.LOGIN, data)
                    }

                    if (!flag)
                        return;

                    // 触发login事件
                    {
                        let data: ILoginData = { username, socketId: so.id };
                        this.fire(PLATFORM_EVENTS.LOGIN, data);
                    }
                    // 触发进入pathnode
                    {
                        let data: IUserJoinData = {
                            pathnodeType: PathnodeType.platform,
                            pathnodeName: this.name,
                            username,
                            socketId: so.id
                        };
                        this.fire(PLATFORM_EVENTS.USER_JOIN, data);
                    }

                    // 通知有人进入节点
                    {
                        let data: IResUserJoinData = { pathnodeName: this.name, username };
                        so.broadcast.emit(PLATFORM_EVENTS.USER_JOIN, data);
                    }
                });
            });

            // 登出
            so.on("disconnect",()=>{
                console.log("disconnect");
            });

            // 进入某个频道
            /*
                频道是否存在
                尝试加入
            */

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
                let { pathnodeName } = chatMsg;
                so.to(pathnodeName).emit(PLATFORM_EVENTS.CHAT, chatMsg);
            });

        });



        // ########################################################
        // 绑定非socket相关
        // ########################################################

        // 用户登录,绑定socket
        this.on(PLATFORM_EVENTS.LOGIN, (data: IUserJoinData) => {
            let { username, socketId } = data;
            this.setSocket(username, socketId);
        });

        // 用户进入节点
        this.on(PLATFORM_EVENTS.USER_JOIN, (data: IUserJoinData) => {
            let { pathnodeName, pathnodeType, username, socketId } = data;
            let socket = this.getSocketBySid(socketId);

            let node = this.findPathnode(pathnodeType, pathnodeName);
            if (node) {
                // 进入socket的房间
                socket.join(pathnodeName, () => {
                    logger.debug(`${username}:${socket.id} join room:${this.name}`);
                });

                // 进入节点
                node.addUser(username);

            }
        });

        // 用户离开节点
        this.on(PLATFORM_EVENTS.USER_LEAVE, (data: IUserLeaveData) => {
            let {username,socketId} = data;
            let root: Pathnode = this;
            let open = [root];
            let stack = [];

            while(open.length){
                let curr = open.pop();
                if(-1!=curr.findUserIndex(username)){
                    stack.push(curr);
                    open = curr.children;
                }
            }

            let socket = this.getSocketBySid(socketId);
            stack.reverse().forEach((node:Pathnode)=>{
                node.removeUser(username);

                socket.leave(node.name);
            });
        });

    }

    private getSocketBySid(socketId: string): SocketIO.Socket {
        return this.io.sockets.sockets[socketId];
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

