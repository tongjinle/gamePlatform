interface IReqLoginData{
	username:string;
	password:string;
}

interface IResLoginData{
	flag:boolean;
}

interface IResUserJoinData{
	pathnodeName:string;
	username:string;
}

// ##### inner event #####
interface ILoginData{

}

interface IUserJoinData{
	pathnodeName:string;
	username:string;
}