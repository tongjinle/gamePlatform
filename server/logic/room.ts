import { IGame, IGameRule, IGameAction, IGameRst } from './IGame';
import Pathnode from './pathnode';
import PathnodeType from './pathnodeType';
import { UserGameStatus } from '../status';
import * as _ from 'underscore';
import GameFactory from './gameFactory';
import { EventEmitter } from 'events';
import { readFile } from 'fs';
import {PLATFORM_EVENTS} from '../events';

interface IPipeItem {
    (): boolean
}
let pipeExecute = (fnList: IPipeItem[]) => {
    _.find(fnList, (fn) => {
        let ret = fn();
        return ret === false;
    });
};


class Room extends Pathnode {

    game: IGame;
    gameType: string;
    rule: IGameRule;
    // 房主名字
    hostname: string;
    constructor(name: string, gameType: string, hostname: string) {
        super(name, PathnodeType.room);

        this.gameType = gameType;
        this.rule = GameFactory.queryGameRule(this.gameType);
        this.hostname = hostname;
    }

    // 开始游戏
    start() {
        let ga = this.game = GameFactory.createGame(this.gameType, this.usernameList);
        ga.start();
    }

    // 
    act(gameAction: IGameAction): IGameRst {
        let ga = this.game;
        let ret = ga.act(gameAction);
        return ret;
    }

    // 用户加入
    join(username: string): boolean {
        // 是否房间已经关闭
        // 是否达到最大人数
        // 是否在黑名单上
        // 是否游戏已经开启
        // 如果是密码房间，判断密码是否匹配


        let ret = this.addUser(username);
        return ret;
    }

    // 踢出用户
    kick(hostname: string, username: string) {
        // 是否游戏已经开启
        // 是否是房主本人
    }

    // 拉黑（禁止进入用户名单）
    addBlackname(username: string) { }

    // 反拉黑
    removeBlackname(username: string) { }

    // 用户准备
    ready(username: string, status: UserGameStatus): boolean {
        // 是否达到最小游戏人数
        if(this.rule.minUserCount > this.usernameList.length){
            return false;
        }
        // 是否都已经准备
        if (-1 == [UserGameStatus.ready, UserGameStatus.unReady].indexOf(status)) {
            return false;
        }
        let ret = this.setStatus(username, status);

        this.fire(PLATFORM_EVENTS.ROOM_USER_READY);

        return ret;
    }

    // 设置状态
    setStatus(username: string, status: UserGameStatus): boolean {
        this.extInfo(username, 'status', status);
        return true;
    }

    // 获取状态
    getStatus(username: string): UserGameStatus {
        return this.extInfo(username, 'status');
    }

    // 离开房间
    leave(username: string): boolean {
        let ret = this.removeUser(username);
        this.fire(PLATFORM_EVENTS.ROOM_USER_LEAVE);
        return ret;
    }

    // 销毁
    dispose(){

    }

    //////
    private bind() {
        // 有用户设置ready的时候，需要检测是否能开始游戏
        this.on(PLATFORM_EVENTS.ROOM_USER_READY, () => {
            // check
            let isAllReady = _.all(
                this.usernameList,
                username => this.getStatus(username) == UserGameStatus.ready
            );

            if (isAllReady) {
                this.start();
            }
        });

        // 当有用户离开的时候
        // 如果没有用户了，则要解散房间(channel去做这个解散的事情)
        // 如果还有用户，如果离开的是房主，则选择下一个房主

        // 当平台pause的时候，房间要pause

        // 当频道pause的时候，房间要pause
        // 当频道dispose的时候，房间要dispose

    }

    private existUsername(username: string): boolean {
        return this.usernameList.indexOf(username) >= 0;
    }



}

export default Room;