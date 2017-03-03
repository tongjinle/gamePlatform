import Room from './room';
import Pathnode from './pathnode';
import PathnodeType from './pathnodeType';
import { PLATFORM_EVENTS } from './events'
import { IChannelOpts } from './iChannel';

class Channel extends Pathnode {
    gameType: string;
    opts: IChannelOpts;

    constructor(name: string, gameType: string, opts: IChannelOpts) {
        super(name, PathnodeType.channel);
        this.gameType = gameType;

        this.opts = opts;

    }

    // ########################################################
    // 自身相关
    // ########################################################
    // 暂停频道
    pause() {

    }


    // 销毁
    dispose() {

    }



    // ########################################################
    // 房间相关
    // ########################################################
    // 创建房间
    createRoom(roomName: string, username: string) {
        let ro = new Room(roomName, this.gameType, username);
        this.children.push(ro);
    }

    // 删除房间
    removeRoom(roomName: string) {
        let ro = this.findChild(roomName) as Room;
        if (ro) { }
    }


    // ########################################################
    // 用户相关
    // ########################################################
    // 用户进入频道
    /*
        用户是否已经在频道
        是否到达最大人数

    */

    // 用户退出频道
    /*
        用户是否已经在频道
        
    */

    // 用户是否已经在频道中

}


export default Channel;