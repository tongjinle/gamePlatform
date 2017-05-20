import * as _ from "underscore";
import * as $ from "jquery";
import * as io from "socket.io-client";
import * as async from "async";

let so: SocketIOClient.Socket = io("http://localhost:9527");
async.parallel([
	(cb) => {
		$(() => {
			$('body').html("hello world1!");
			cb();
		});
	},
	(cb) => {
		so.on("connect", () => {
			console.log(so.id);
			cb();
		});
	}
], (err, data) => {
	!err && start();
});

function start() {

	bindSocket();

}

_.forEach([1, 2], n => console.log(n));





function bindSocket() {
	so.emit("login", () => { })


}

