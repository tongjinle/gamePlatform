const PLATFORM_EVENTS = {
    // 账户登录
    LOGIN:"login",
    LOGOUT:"logout",

    // 平台操作
    PLATFORM_USER_JOIN: "platform_user_join",
    PLATFORM_USER_LEAVE: "platform_user_leave",

    // 频道操作
    CHANNEL_ADD: "channel_add",
    CHANNEL_PAUSE: "channel_pause",
    CHANNEL_REMOVE: "channel_remove",
    CHANNEL_DISPOSE: "channel_dispose",

    CHANNEL_USER_JOIN: "channel_user_join",
    CHANNEL_USER_LEAVE: "channel_user_leave",

    // 房间操作
    ROOM_ADD: "room_add",
    ROOM_PAUSE: "room_pause",
    ROOM_REMOVE: "room_remove",
    ROOM_DISPOSE: "room_dispose",

    ROOM_USER_JOIN: "room_user_join",
    ROOM_USER_LEAVE: "room_user_leave",
    ROOM_USER_READY: "room_user_ready",

    // 进入
    SOCKET_ROOM_JOIN:"socket_room_join",

    // 聊天
    CHAT: "chat",

    // 游戏操作
    GAME_ACT: "game_act",

    // 用户在
    SOCKET_ROOM_REFRESH:"socket_room_refresh"



};


import * as SocketServer from 'socket.io';
// 事件的数据结构

// server端内部数据结构
interface IPlatformfUserJoin {
    username:string;
    socket:SocketIO.Socket;
}


// to client的数据结构
interface IPlatformUserJoin_C{
    username:string;
}














export {
    PLATFORM_EVENTS,

    // 事件的数据结构
    // sever内部
    IPlatformfUserJoin,


    // to client
    IPlatformUserJoin_C

};











