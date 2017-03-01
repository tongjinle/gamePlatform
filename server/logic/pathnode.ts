import PathnodeType from './pathnodeType';
import * as _ from 'underscore';
import { EventEmitter } from 'events';
import IUser from './iUser';

abstract class Pathnode extends EventEmitter {
    // eg: '华东区' '围棋' '第一桌'诸如此类
    name: string;
    // eg: 'channel' 'room'
    type: PathnodeType;
    father: Pathnode;
    children: Pathnode[];
    // 深度 channel为0 room为1
    private _depth: number;
    public get depth(): number {
        return [PathnodeType.channel, PathnodeType.room].indexOf(this.type);
    }
    // 用户列表
    usernameList: string[];
    // 用户信息
    private userExtInfoList: { [key: string]: any }[];


    constructor(name: string, type: PathnodeType) {
        super();

        this.name = name;
        this.type = type;

        this.usernameList = [];
        this.userExtInfoList = [];

        this.father = undefined;
        this.children = [];
    }

    // 触发事件
    fire(eventname: string, data: any = {}) {
        data.currTarget = data.currTarget || this;
        this.emit(eventname, data);
        // 冒泡
        if (this.father) {
            this.father.fire(eventname, data);
        }
        // 广播
        if (this.children) {
            _.forEach(this.children, ch => ch.fire(eventname, data));
        }
    }



    // 增加用户
    addUser(username: string): boolean {
        let index = this.findUserIndex(username);
        if (-1 == index) {
            this.usernameList.push(username);
            this.userExtInfoList.push({});
            return true;
        }
        return false;
    }

    // 删除用户
    removeUser(username: string): boolean {
        let index = this.findUserIndex(username);

        if (-1 == index) {
            return false;
        }

        this.usernameList.splice(index, 1);
        this.userExtInfoList.splice(index, 1);
        return true;
    }

    protected extInfo(username: string, key: string, value?: any) {
        let index = this.findUserIndex(username);

        if (-1 == index) {
            throw 'invalid username';
        }

        let info = this.userExtInfoList[index];
        return value === undefined ?
            info[key] :
            info[key] = value;

    }

    // 根据child的name来找到下级child
    protected findChild(childName:string):Pathnode{
        return _.find(this.children,ch=>ch.name == childName);
    }
    

    // 寻找user对应的下标
    protected findUserIndex(username: string): number {
        return _.findIndex(this.usernameList, us => us == username);
    }
}



export default Pathnode;
