const PLATFORM_EVENTS = {
    // 频道操作
    CHANNEL_ADD: "channel_add",
    CHANNEL_PAUSE: "channel_pause",
    CHANNEL_REMOVE: "channel_remove",
    CHANNEL_JOIN: "channel_join",
    CHANNEL_LEAVE: "channel_leave",
    CHANNEL_DISPOSE:"channel_dispose",

    // 房间操作
    ROOM_ADD: "room_add",
    ROOM_PAUSE: "room_pause",
    ROOM_REMOVE: "room_remove",
    ROOM_DISPOSE:"room_dispose",

    ROOM_USER_JOIN: "room_user_join",
    ROOM_USER_LEAVE: "room_user_leave",
    ROOM_USER_READY:"room_user_ready",


    // 

    // 聊天
    CHAT: "chat",

    // 游戏操作
    GAME_ACT: "game_act"



};

export { PLATFORM_EVENTS };