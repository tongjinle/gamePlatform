import * as SocketServer from "socket.io";
import PathnodeType from './pathnodeType';
import Channel from './channel';
// ##### to client event #####
export interface IReqLoginData {
	username: string;
	password: string;
}

export interface IResLoginData {
	flag: boolean;
	username:string;
}

export interface IResUserJoinData {
	flag:boolean;
	pathnodeName: string;
	username: string;
}

export interface IResUserLeaveData {
	flag:boolean;
	pathnodeName: string;
	username: string;
}

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

// ##### platform event #####
export interface ILoginData {
	username: string;
	socketId: string;
}

export interface ILogoutData {
	username: string;
	socketId: string;
}

export interface IChannelAddData{
	channel:Channel
}
export interface IChannelRemoveData{
	channel:Channel

}

export interface IUserJoinData {
	pathnodeName: string;
	pathnodeType: PathnodeType;	
	username: string;
	socketId: string;
}


export interface IUserLeaveData {
	pathnodeName: string;
	pathnodeType: PathnodeType;
	username: string;
	socket: SocketIO.Socket;
}