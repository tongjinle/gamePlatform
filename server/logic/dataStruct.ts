import * as SocketServer from "socket.io";
import PathnodeType from './pathnodeType';
import Channel from './channel';
// ##### to client event #####

// 登录
export interface IReqLoginData {
	userName: string;
	password: string;
}

export interface IResLoginData {
	flag: boolean;
	userName: string;
}

export interface INotifyLoginData {
	userName: string;
}

// 登出
export interface IReqLogoutData {
}

export interface IResLogoutData {
	flag: boolean;
}

export interface INotifyLogoutData {
	userName: string;
}

// 进入房间
export interface IReqUserJoinRoomData {
	roomName: string;
}

export interface IResUserJoinRoomData {
	flag: boolean;
	roomName: string;
}

export interface INotifyJoinRoomData {
	roomName: string;
	userName: string;
}

// 退出房间
export interface IReqUserLeaveRoomData {
}

export interface IResUserLeaveRoomData {
	flag: boolean;
}

export interface INotifyLeaveRoomData {
	roomName: string;
	userName: string;
}


// 聊天
// '世界聊天' | '房间聊天' | '个人聊天'
export interface IReqChat {
	message: string;
	type: 'world' | 'room' | 'personal';
	// to是对某人的私人聊天
	to?: string;
}

export interface IResChat {
	flag: boolean;
}

export interface INotifyChat{
	from: string;
	to?: string;
	message: string;
	// to是对某人的私人聊天
	isPrivate: boolean;
	timeStamp: number;

}

// 用户列表
export interface IResUserInfo {
	userName: string
}
export interface IResUserList extends Array<IResUserInfo> {
}
