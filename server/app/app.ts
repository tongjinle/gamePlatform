import * as _ from 'underscore';
import * as SocketServer from 'socket.io';
import * as Http from 'http';
import * as async from 'async';
import Platform from '../logic/platform';
import { PlatformConfig as pfConfig } from '../platformConfig';


class App {
	platfrom: Platform;
	constructor() {
		let pl = this.platfrom = new Platform();
		pl.initByConf(pfConfig);

        this.dict = {};
        this.bindSocket();

	}

    dict:{[socketId:string]:string};
    
    bindList:[(app:App,socket:SocketServer.Client)=>void];

    io:SocketIO.Server;

    private bindSocket(){
        
    }

}


let app = new App();

