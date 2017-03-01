import * as _ from 'underscore';
import * as SocketServer from 'socket.io';
import * as Http from 'http';
import * as async from 'async';
import CONFIG from './config';
import * as log4js from 'log4js';
import { PfEvent } from './types';
import { getUserCenter } from './userCenter/userCenter';
import { getUserCache } from './userCenter/userCache';

log4js.configure({
    appenders: [
        { type: 'console' },
        {
            type: 'dateFile',
            filename: './logs/app.log',
            "maxLogSize": 20480,
            "backups": 3,
            category: 'app'

        }
    ]
});


let logger = log4js.getLogger('app');
let usCenter = getUserCenter();
let usCache = getUserCache();

class App {
    serv: Http.Server;
    io: SocketIO.Server;
    constructor() {
        this.serv = Http.createServer();
        this.io = SocketServer(this.serv);
        this.serv.listen(CONFIG.PORT, () => {
            logger.debug(`start server at ${new Date().toTimeString()}`);
        });

        this.bind();
    }



    
    private bind() {
        let io = this.io;
        // 连接
        io.on('connect', so => {
            // 登陆
            // 登陆之后 在默认的大厅中
            so.on(PfEvent[PfEvent.login], (data: { username: string, password: string }) => {
                let {username, password} = data;
                usCenter.login(username, password, data => {
                    let flag = data.flag;
                    let token:string = undefined;
                    if(data.flag){
                        token = usCache.add(username);
                    }
                    so.emit(PfEvent[PfEvent.login],{
                        flag,
                        token
                    });
                });
            });

            // 查询所有游戏频道
            // so.on()

            so.on(PfEvent[PfEvent.joinChannel],(data:{chname:string})=>{

            });

            // 进入某个频道

            // 退出某个频道

            // 查询某个频道中所有房间

            // 进入某个房间

            // 退出某个房间

            // 游戏操作信息

            // 发送聊天信息




        });

        io.use((so,next)=>{
            so.request.header.token
        });
    }

}


let app = new App();

