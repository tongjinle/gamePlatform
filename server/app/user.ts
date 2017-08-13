import App from "./app";
import * as SocketServer from 'socket.io';
import * as dataStruct from "../logic/dataStruct";
import {
    TO_CLIENT_EVENTS,
    PLATFORM_EVENTS
} from '../logic/events';
import {
    UserCenter,
    getUserCenter
} from "../db/userCenter/userCenter";
let usCenter = getUserCenter();
import {
    getUserCache
} from "../db/userCenter/userCache"
let usCache = getUserCache();

export enum EUserStatus {
    PreLogin,
    OnLine,
    OffLine
}

export class User {
    username: string;
    app: App;
    // 状态
    private _status: EUserStatus;
    public get status(): EUserStatus {
        return this._status;
    }
    public set status(v: EUserStatus) {
        this._status = v;

        let status = this._status;
        let so = this.so;

        // 连接,但是尚未登陆
        if (EUserStatus.PreLogin == status) {
            // 监听
            so.on(TO_CLIENT_EVENTS.LOGIN, this.login);
            return;
        }

        // 在线
        if (EUserStatus.OnLine == status) {
            // 监听
            so.on('disconnect', this.logout);
            so.on(TO_CLIENT_EVENTS.CHAT, this.chat);
            so.on(TO_CLIENT_EVENTS.USER_JOIN, this.enterNode);
            so.on(TO_CLIENT_EVENTS.USER_LEAVE, this.leaveNode);
            // 反监听
            so.removeListener(TO_CLIENT_EVENTS.LOGIN, this.login);
            return;
        }

        // 离线
        if (EUserStatus.OffLine == status) {
            // 反监听
            so.removeListener('disconnect', this.logout);
            so.removeListener(TO_CLIENT_EVENTS.CHAT, this.chat);
            so.removeListener(TO_CLIENT_EVENTS.USER_JOIN, this.enterNode);
            so.removeListener(TO_CLIENT_EVENTS.USER_LEAVE, this.leaveNode);
            return;
        }
    }

    // 房间路径
    path: string[];

    // 当前节点 
    public get currNodeName(): string {
        return this.status == EUserStatus.PreLogin ?
            undefined :
            this.path[this.path.length - 1];
    }

    // socket
    so: SocketIO.Socket;

    constructor(so: SocketIO.Socket) {
        this.username = "";
        this.status = EUserStatus.PreLogin;
        this.path = [];
        this.so = so;

    }

    // 登录
    login(data: dataStruct.IReqLoginData) {
        let { username, password } = data;
        usCenter.login(username, password, (data => {
            let { flag } = data;

            // 通知客户端--登录结果
            {
                let data: dataStruct.IResLoginData = {
                    flag,
                    username
                };
                this.so.emit(TO_CLIENT_EVENTS.LOGIN, data);
            }

            if (flag) {
                this.username = username;
                // 装入缓存
                usCache.add(this);
                // 状态切换
                this.status = EUserStatus.OnLine;
                // 进入"platform"节点--自动
                {
                    let flag = this.enterNode("platform");
                    if (flag) {
                        // 通知客户端--platform来了新的user
                        let data: dataStruct.IResUserJoinData = {
                            flag,
                            pathnodeName: 'platform',
                            username
                        };
                        this.so.emit(TO_CLIENT_EVENTS.USER_JOIN, data);
                    }
                }
            }
        }));
    }

    // 登出
    logout(data: dataStruct.IReqLogoutData) {
        usCenter.logout(this.username, (data) => {
            let { flag } = data;

            // 通知客户端--登出结果
            {
                let data: dataStruct.IResLogoutData = {
                    flag
                };
                this.so.emit(TO_CLIENT_EVENTS.LOGOUT, data);
            }

            if (flag) {
                // 状态切换
                this.status = EUserStatus.OffLine;

                // 退出所有节点
                while (this.leaveNode()) { }
            }
        });
    }

    // 断线
    disconnect() {
        usCenter.logout(this.username, (data) => {

        });
    }

    // 查询当前房间用户
    queryUserList(): void {
        let data: dataStruct.IResUserList = [];

        usCache.findByNodeName(this.currNodeName)
            .forEach(item => {
                data.push({
                    username: item.data.username
                });
            });
        this.so.emit(TO_CLIENT_EVENTS.USER_LIST, data);
    }


    // 进入节点
    enterNode(nodeName: string): boolean {
        // todo 
        // 判断是否有这么个节点,和是否能进入
        let node = this.app.getNodeByName(nodeName);
        if (node && node.father.name == this.currNodeName) {
            this.path.push(nodeName);
            let data: dataStruct.IResUserJoinData = {
                flag: true,
                pathnodeName: nodeName,
                username: this.username
            };
            this.so.join(nodeName);
            this.app.io.to(nodeName).emit(TO_CLIENT_EVENTS.USER_JOIN, data);
            return true;
        }
        return false;
    }

    // 退出节点
    leaveNode(): boolean {
        let nodeName = this.currNodeName;
        if (nodeName) {
            this.path.pop();
            let data: dataStruct.IResUserLeaveData = {
                flag: true,
                pathnodeName: nodeName,
                username: this.username
            };
            this.so.leave(nodeName);
            this.app.io.to(nodeName).emit(TO_CLIENT_EVENTS.USER_LEAVE, data);
            return true;
        }
        return false;
    }

    // 聊天
    chat(data: dataStruct.IReqChat): void {
        let { message, to } = data;

        let nodeName = this.currNodeName;
        let username = this.username;
        let timestamp = Date.now();

        if (to) {
            let data: dataStruct.IResChat = {
                flag: true,
                from:username,
                message,
                isPrivate: true,
                timestamp
            };
            this.so.broadcast.to(nodeName).emit(TO_CLIENT_EVENTS.CHAT, data);
        } else {
            let data: dataStruct.IResChat = {
                flag: true,
                from:username,
                message,
                isPrivate: false,
                timestamp
            };
            this.app.io.to(nodeName).emit(TO_CLIENT_EVENTS.CHAT, data);

        }

    }


    // 游戏操作
    gameAct(): void {

    }


}



export class UserMgr {
}
