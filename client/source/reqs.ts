import * as io from "socket.io-client";
class Reqs{
	so:SocketIOClient.Socket;
	constructor(so:SocketIOClient.Socket) {
		this.so = so;
	}

	  // 登陆
    login(username: string, password: string) {
        this.so.emit('login', { username, password });
    };

    // 登出
    logout() {
        this.so.emit('logout');
    };

    // 获取用户
    userlist(pathnodeName: string, token: string) {
        this.so.emit('userlist', { pathnodeName, token });
    };

    // 聊天
    chat(message: string, to?: string) {
        this.so.emit('chat', { message, to });
    };
}

export default Reqs; 