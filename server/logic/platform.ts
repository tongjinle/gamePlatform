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
import { PLATFORM_EVENTS } from './events';
import logger from "./logIns";
import './dataStruct';



let usCenter = getUserCenter();
let usCache = getUserCache();
class Platform extends Pathnode {
    serv: Http.Server;
    io: SocketIO.Server;
    constructor() {
        super('platform', PathnodeType.platform);

        this.serv = Http.createServer();
        this.io = SocketServer(this.serv);


        this.serv.listen(CONFIG.PORT, () => {
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
            so.on(PLATFORM_EVENTS.LOGIN, (data: IReqLoginData) => {
                let { username, password } = data;
                usCenter.login(username, password, data => {
                    let flag = data.flag;
                    let token: string;

                    // 登录回执
                    {
                        let speSocket = io.sockets.sockets[so.id];
                        let data: IResLoginData = { flag };
                        speSocket.emit(PLATFORM_EVENTS.LOGIN, data)
                    }

                    if (!flag)
                        return;

                    // 触发login事件
                    {
                        let data: ILoginData = { username, socketId: so.id };
                        this.fire(PLATFORM_EVENTS.LOGIN, data);
                    }
                    // 触发进入pathnode时间
                    {
                        let data: IUserJoinData = { pathnodeName: this.name, username };
                    }

                    // 通知有人进入节点
                    {
                        let data: IUserJoinData = { pathnodeName: this.name, username };
                        so.broadcast.emit(PLATFORM_EVENTS.ON_USER_JOIN, data);
                    }
                });
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

        // 用户进入大厅
        // 绑定socket
        // this.on(PLATFORM_EVENTS.ON_USER_JOIN, (data: IUserJoinData) => {
        //     let { username, socket } = data;
        //     this.setSocket(username, socket);
        // });

        // // 加入socket的room -- platform
        // this.on(PLATFORM_EVENTS.PLATFORM_USER_JOIN, (data: IPlatformfUserJoin) => {
        //     let { username, socket } = data;
        //     socket.join(this.name, () => {
        //         logger.debug(`${username}:${socket.id} join room:${this.name}`);
        //     });
        // });
    }





}

export default Platform;

