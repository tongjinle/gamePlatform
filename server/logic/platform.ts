import Channel from './channel';
import Pathnode from './pathnode';
import PathnodeType from './pathnodeType';
import * as pfConfig from '../platformConfig';
import * as _ from 'underscore';
import 'socket.io';

class Platform extends Pathnode {
    io: SocketIO.Server;
    constructor(io: SocketIO.Server) {
        super('platform', PathnodeType.platform);

        this.initByConf(pfConfig);
        this.bind();
    }

    // 根据配置文件来生成频道
    initByConf(conf) {
        _.each(conf.channelList, (chan: { name: string, gameType: string }) => {
            this.addChannel(chan.name, chan.gameType);
        });
    }

    private bind() { }

    // 创建频道
    private addChannel(channelName: string, gameType: string) {
        let ch = new Channel(channelName, gameType);
        this.children.push(ch);
    }

    // 暂停频道
    private pauseChannel(channelName: string):boolean {
        let chan = this.findChild(channelName) as Channel;
        if(!chan){
            return false;
        }
        
        chan.pause();
    }


    // 删除频道
    private removeChannel(channelName: string) {

    }

    // 




}

export default Platform;