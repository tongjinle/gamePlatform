// 聊天数据格式
interface IChatMsg {
	// 发送信息者
	from:string;
	// 接受信息者,如果to不为空,则该信息为私密信息
	to?:string;
	// 接受信息的pathnode
    pathnodeName: string;
    // 信息实体
    message:string;
    // 时间戳
    timeStamp:number;

}



export {
    IChatMsg
}