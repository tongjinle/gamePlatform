/*
    Pathnode是整个游戏平台树的各个节点的类型
    1 father和children,用以维护树状结构
    2 fire,依赖于[1]中的结构,分别完成"冒泡"和"广播"事件
    3 由于平台相对简单,只考虑3层深度,所以depth方法简单处理(platform为0 channel为1 room为2)
    4 节点同时维护身处节点中的user列表
        如果user处于某节点中,则必定处于其父节点中,直到根节点
    5 为了可以自定义user的属性,使用extInfo(username: string, key: string, value?: any)函数,风格同jquery
*/

import PathnodeType from './pathnodeType';
import PathnodeStatus from './PathnodeStatus';
import * as _ from 'underscore';
import { EventEmitter } from 'events';
import IUser from './iUser';
import logger from './logIns';

abstract class Pathnode extends EventEmitter {
    // eg: '华东区' '围棋' '第一桌'诸如此类
    name: string;
    // eg: 'channel' 'room'
    type: PathnodeType;
    father: Pathnode;
    children: Pathnode[];
    // 深度 platform为0 channel为1 room为2
    private _depth: number;
    public get depth(): number {
        return [PathnodeType.platform, PathnodeType.channel, PathnodeType.room].indexOf(this.type);
    }
    // 用户列表
    usernameList: string[];
    // 用户信息
    private userExtInfoList: { [key: string]: any }[];
    // 状态
    status: PathnodeStatus;

    constructor(name: string, type: PathnodeType) {
        super();

        this.name = name;
        this.type = type;

        this.usernameList = [];
        this.userExtInfoList = [];

        this.father = undefined;
        this.children = [];
        this.status = PathnodeStatus.open;

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

    // 寻找user对应的下标
    findUserIndex(username: string): number {
        return _.findIndex(this.usernameList, us => us == username);
    }


    // 增加用户
    addUser(username: string): boolean {
        let index = this.findUserIndex(username);
        if (-1 == index) {
            this.usernameList.push(username);
            this.userExtInfoList.push({});
            logger.info(`pathnode[${this.name}] addUser[${username}]`);
            return true;
        }
        logger.debug(`${index},false`);
        return false;
    }

    // 删除用户
    removeUser(username: string): boolean {
        let index = this.findUserIndex(username);

        if (-1 == index) {
            return false;
        }

        logger.info(`pathnode[${this.name}] removeUser[${username}]`);
        this.usernameList.splice(index, 1);
        this.userExtInfoList.splice(index, 1);
        return true;
    }

<<<<<<< HEAD
    extInfo(username: string, key: string, value?: any) {
=======
    // 寻找user对应的下标
    findUserIndex(username: string): number {
        logger.debug(this.usernameList.join('|'));
        return _.findIndex(this.usernameList, us => us == username);
    }

    protected extInfo(username: string, key: string, value?: any) {
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
        let index = this.findUserIndex(username);

        if (-1 == index) {
            logger.error(`invalid username:${username}`);
            throw 'invalid username';
        }

        let info = this.userExtInfoList[index];
        if (undefined === value) {
            return info[key];
        } else {
            info[key] = value;
            return true;
        }

    }

    // 查找子孙
    findDescendant(name: string): Pathnode {
        let open = this.children;
        while (open.length) {
            let curr = open.pop();
            if (curr.name == name) {
                return curr;
            }
            if (curr.children && curr.children.length) {
                open = open.concat(curr.children);
            }
        }
    }


    // 根据child的name来找到下级child
    findChild(childName: string): Pathnode {
        return _.find(this.children, ch => ch.name == childName);
    }

    // 增加child
<<<<<<< HEAD
    addChild(child: Pathnode): boolean {
=======
    protected addChild(child: Pathnode): boolean {
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
        if (this.findChild(child.name)) {
            return false;
        }
        this.children.push(child);
        return true;
    }

    // 删除child
    removeChild(child: Pathnode): boolean {
        if (!child) {
            return false;
        }
        return this.removeChildByName(child.name);
    }

    removeChildByName(childName: string): boolean {
        let index = _.findIndex(this.children, ch => ch.name == childName);
        if (-1 == index) {
            return false;
        }
        this.children.splice(index, 1);
        return false;
    }


<<<<<<< HEAD
    
=======

>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
}



export default Pathnode;
