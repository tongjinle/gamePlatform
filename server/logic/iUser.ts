enum EUserStatus{
    Normal

}

interface IUser{
    usernames:string;
    // 状态
    status:EUserStatus;
    // 房间路径
    path:string[];
    // socket id
    socketId:string;
}

export default IUser;