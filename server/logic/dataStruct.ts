import PathnodeType from './pathnodeType';

// ##### to client event #####
export interface IReqLoginData {
	username: string;
	password: string;
}

export interface IResLoginData {
	flag: boolean;
}

export interface IResUserJoinData {
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

export interface IUserJoinData {
	pathnodeName: string;
	pathnodeType: PathnodeType;
	username: string;
	socketId: string;
}


export interface IUserLeaveData {
	username: string;
	socketId: string;
}