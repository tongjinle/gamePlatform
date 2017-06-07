<<<<<<< HEAD
const PLATFORM_EVENTS = {
    // 账户登录
    LOGIN:"login",
    LOGOUT:"logout",

=======
import * as SocketServer from 'socket.io';
import * as _ from 'underscore';

let TO_CLIENT_EVENTS = {
    LOGIN: "",
    LOGOUT: "",

    CHAT: "",

    USER_JOIN: "",
    USER_LEAVE:"",

    USER_LIST:"",

    SUB_PATHNODE_LIST:""

};

let PLATFORM_EVENTS = {
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
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

<<<<<<< HEAD
    // 进入
    SOCKET_ROOM_JOIN:"socket_room_join",
=======


    // 获取某个pathnode的所有用户
    USERLIST: "",
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab

    // 聊天
    CHAT: "",

    // 游戏操作
<<<<<<< HEAD
    GAME_ACT: "game_act",

    // 用户在
    SOCKET_ROOM_REFRESH:"socket_room_refresh"
=======
    GAME_ACT: "",

    // 加入某个pathnode
    USER_JOIN: "",
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab

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

<<<<<<< HEAD
import * as SocketServer from 'socket.io';
// 事件的数据结构

// server端内部数据结构
interface IPlatformfUserJoin {
    username:string;
    socket:SocketIO.Socket;
}
=======
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab


// to client的数据结构
interface IPlatformUserJoin_C{
    username:string;
}














export {
    PLATFORM_EVENTS,
    TO_CLIENT_EVENTS

<<<<<<< HEAD
    // 事件的数据结构
    // sever内部
    IPlatformfUserJoin,


    // to client
    IPlatformUserJoin_C

};











=======
};
>>>>>>> 6b11f8841dadf61d7cb00909e4615522bb4ad8ab
