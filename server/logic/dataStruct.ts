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