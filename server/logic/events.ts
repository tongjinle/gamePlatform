import * as SocketServer from 'socket.io';
import * as _ from 'underscore';

let PLATFORM_EVENTS = {
    // 平台操作
    LOGIN: "",
    LOGOUT: "",

    // 频道操作
    CHANNEL_ADD: "",
    CHANNEL_PAUSE: "",
    CHANNEL_REMOVE: "",
    CHANNEL_DISPOSE: "",



    // 房间操作
    ROOM_ADD: "",
    ROOM_PAUSE: "",
    ROOM_REMOVE: "",
    ROOM_DISPOSE: "",




    // 获取某个pathnode的所有用户
    USERLIST: "",

    // 聊天
    CHAT: "",

    // 游戏操作
    GAME_ACT: "",

    // 加入某个pathnode
    ON_USER_JOIN: "",

    // 离开某个pathnode
    ON_USER_LEAVE: "",

    // 接受到聊天信息
    ON_CHAT: ""


};

// simple map
for (let key in PLATFORM_EVENTS) {
    let str: string = key.split('_')
        .map((str, i) => {
            if (i == 0) {
                return str.toLowerCase();
            } else {
                return str[0].toUpperCase() + str.slice(1).toLowerCase();
            }
        })
        .join('');

    PLATFORM_EVENTS[key] = str;
}


// 事件的数据结构
interface IPlatformfUserJoin {
    username: string;
    socket: SocketIO.Socket;
}

















export {
    PLATFORM_EVENTS,

    // 事件的数据结构
    IPlatformfUserJoin
};