// 聊天数据格式
interface IChatMsg {
    // socket room
    roomName:string;
    from:string;
    msg:string;
    toList?:string[];

}



export {
    IChatMsg
}