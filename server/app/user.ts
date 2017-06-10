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
            so.on(TO_CLIENT_EVENTS.LOGIN, this.login);
            return;
        }

        // 在线
        if (EUserStatus.OnLine == status) {
            so.removeListener(TO_CLIENT_EVENTS.LOGIN, this.login);
            return;
        }

        // 离线
        if (EUserStatus.OffLine == status) {
            return;
        }
    }

    // 房间路径
    path: string[];

    // 当前路径 
    public get currNode(): string {
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
            if (flag) {
                this.status = EUserStatus.OnLine;

                // 通知客户端--登录结果
                {
                    let data: dataStruct.IResLoginData = {
                        flag,
                        username
                    };
                    this.so.emit(TO_CLIENT_EVENTS.LOGIN, data);
                }
                // 进入"platform"节点
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


    enterNode(nodename: string): boolean {
        // todo 
        // 判断是否有这么个节点,和是否能进入

        this.path.push(nodename);
        return true;
    }

    leaveNode(): boolean {
        return this.path.pop() !== undefined;
    }


}



export class UserMgr {
}
