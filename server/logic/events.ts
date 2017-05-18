import * as SocketServer from 'socket.io';
import * as _ from 'underscore';

let TO_CLIENT_EVENTS = {
    LOGIN: "",
    LOGOUT: "",

    CHAT: "",

    USER_JOIN: ""

};

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

    ROOM_USER_READY: "",



    // 获取某个pathnode的所有用户
    USERLIST: "",

    // 聊天
    CHAT: "",

    // 游戏操作
    GAME_ACT: "",

    // 加入某个pathnode
    USER_JOIN: "",

    // 离开某个pathnode
    USER_LEAVE: ""



};

let proc = (obj, prefix) => {
    for (let key in obj) {
        let str: string = key.split('_')
            .map((str, i) => {
                if (i == 0) {
                    return str.toLowerCase();
                } else {
                    return str[0].toUpperCase() + str.slice(1).toLowerCase();
                }
            })
            .join('');

        obj[key] = prefix + str;
    }
};

proc(TO_CLIENT_EVENTS, "");
proc(PLATFORM_EVENTS, "platform_");


















export {
    PLATFORM_EVENTS,
    TO_CLIENT_EVENTS

};