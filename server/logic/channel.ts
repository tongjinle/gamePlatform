import Room from './room';
import Pathnode from './pathnode';
import PathnodeType from './pathnodeType';
import { PLATFORM_EVENTS } from '../events'

class Channel extends Pathnode {
    gameType: string;
    constructor(name: string, gameType: string) {
        super(name, PathnodeType.channel);
        this.gameType = gameType;
    }

    // 创建房间
    createRoom(roomName: string, username: string) {
        let ro = new Room(roomName, this.gameType, username);
        this.children.push(ro);
    }

    // 删除房间
    removeRoom(roomName:string){
        let ro = this.findChild(roomName) as Room;
        if(ro){}
    }

    // 暂停频道
    pause(){
        
    }


    //
    //
}


export default Channel;