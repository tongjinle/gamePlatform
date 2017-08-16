import {
    ELeaveRoomReason,
    EEndGameReason,
    EGameType,
    EChatType,
    EPlatformStatus,
    EGameStatus,
    ERoomStatus,
    EFlagColor
} from './enums';

// ########################
// 登录
// ########################
export interface IReqLogin {
    userName: string;
    password: string;
};

export interface IResLogin {
    flag: boolean;
    userName: string;
};

export interface INotifyLogin {
    userName: string;
};

// ########################
// 登出
// ########################
export interface IReqLogout {
};

export interface IResLogout {
    flag: boolean;
};

export interface INotifyLogout {
    userName: string;
};




// ########################
// 聊天
// ########################
export interface IReqChat {
    message: string;
    type: EChatType
    // to是对某人的私人聊天
    to?: string;
};

export interface IResChat {
    flag: boolean;
};

export interface INotifyChat {
    from: string;
    type: EChatType;
    to?: string;
    message: string;
    timestamp: number;
};


// ########################
// 用户
// ########################

// 用户当前的游戏信息
export interface IGameInfo {
    // 玩家数量
    palyerCount: number;
    // 观战者数量
    watcherCount: number;
    //
    stepCount: number;
    startTimestamp: number;
    endTimestamp: number;
    currTimestamp: number;
    winColor: EFlagColor;
    status: EGameStatus;
};

// 基本用户信息[简略版本]
export interface IUserInfoShort {
    userName: string;
    gameStatus: EGameStatus;
    roomId: number;
};

// 用户信息
export interface IUserInfo extends IUserInfoShort {
    platformStatus: EPlatformStatus;
    gameInfo: IGameInfo;
};

// 获取在线用户列表
export interface IReqOnlineUserList {

};

export interface IResOnlineUserList {
    flag: boolean;
    list: IUserInfoShort[];
};


// ########################
// 房间
// ########################
// 基本房间信息[简略版本]

export interface IRoomInfoShort {
    // 游戏类型
    gameType: EGameType;
    // 房间状态
    status: ERoomStatus;
    // 游戏状态
    gameStatus: EGameStatus;
    // 是否可以加入游戏
    canBePlayer: boolean;
    // 是否可以观战
    canBeWatcher: boolean;
    // 房主
    hostName: string;
};

// 获取房间列表
export interface IReqRoomList {

};

export interface IResRoomList {
    flag: boolean;
    list: IRoomInfoShort[];
};



// 进入房间
export interface IReqUserJoinRoom {
    roomId: string;
};

export interface IResUserJoinRoom {
    flag: boolean;
    roomId: string;
};

export interface INotifyJoinRoom {
    roomId: string;
    userName: string;
};

// 退出房间
export interface IReqUserLeaveRoom {
};

export interface IResUserLeaveRoom {
    flag: boolean;
};

export interface INotifyLeaveRoom {
    roomId: string;
    userName: string;
    leaveRoomReason: ELeaveRoomReason;
};

// 踢出房间中某个选手
export interface IReqKick {
    userName: string;
};

export interface IResKick {
    flag: boolean;
};

// 开始房间中的游戏
export interface IReqStartGame {
    roomId: string;
};
export interface IResStartGame {
    flag: boolean;
};
export interface INotifyStartGame {
    roomId: string;
};


// 放弃房间中的游戏[即投降]
export interface IReqEndGame {
    roomId: string;
};

export interface IResEndGame {
    flag: boolean;
};

export interface INotifyEndGame {
    endGameReason: EEndGameReason;
    userName?: string;
};





