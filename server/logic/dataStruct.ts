import * as SocketServer from "socket.io";
import PathnodeType from './pathnodeType';
import Channel from './channel';
// ##### to client event #####

// 登录
export interface IReqLoginData {
	username: string;
	password: string;
}

export interface IResLoginData {
	flag: boolean;
	username:string;
}

// 登出
export interface IReqLogoutData{

}

export interface IResLogoutData{
	flag: boolean;
}

// 进入房间
export interface IReqUserJoinData {
	pathnodeName: string;
}

export interface IResUserJoinData {
	flag:boolean;
	pathnodeName: string;
	username: string;
}

// 退出房间
export interface IResUserLeaveData {
	flag:boolean;
	pathnodeName: string;
	username: string;
}

// 聊天
export interface IReqChat{
	message:string;
	// to是对某人的私人聊天
	to?:string;
}

export interface IResChat{
	flag:boolean;
	username:string;
	message:string;
	// to是对某人的私人聊天
	isPrivate:boolean;	
	timestamp:number;
}

