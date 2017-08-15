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

export interface INotifyLogoutData{
	userName: string;
}

// 进入房间
export interface IReqUserJoinData {
	pathnodeName: string;
}

export interface IResUserJoinData {
	flag: boolean;
	pathnodeName: string;
	userName: string;
}

// 退出房间
export interface IResUserLeaveData {
	flag: boolean;
	pathnodeName: string;
	userName: string;
}

// 聊天
export interface IReqChat {
	message: string;
	// to是对某人的私人聊天
	to?: string;
}

export interface IResChat {
	flag: boolean;
	from: string;
	message: string;
	// to是对某人的私人聊天
	isPrivate: boolean;
	timestamp: number;
}


// 用户列表
export interface IResUserInfo {
	userName: string
}
export interface IResUserList extends Array<IResUserInfo> {
}
